import ExpoModulesCore
import UIKit

/// Reports iPhone Duo hinge state to JS as `RawHinge`:
///   { angle: degrees, status, innerDisplayActive, foldRect: {x,y,width,height} in window points | null }
/// Returns nil (JS: null) on devices or SDKs without a hinge.
public class DuoHingeModule: Module {
  private let lock = NSLock()
  private var latest: [String: Any]?
  private var tracker: AnyObject?

  public func definition() -> ModuleDefinition {
    Name("DuoHinge")

    Events("onHingeChange")

    Function("getHingeState") { () -> [String: Any]? in
      self.lock.lock(); defer { self.lock.unlock() }
      return self.latest
    }

    OnStartObserving("onHingeChange") {
      DispatchQueue.main.async { self.startTracking() }
    }

    OnStopObserving("onHingeChange") {
      DispatchQueue.main.async { self.tracker = nil }
    }
  }

  private func publish(_ payload: [String: Any]?) {
    lock.lock(); latest = payload; lock.unlock()
    sendEvent("onHingeChange", payload.map { ["value": $0] } ?? [:])
  }

  private func startTracking() {
    guard tracker == nil, let window = Self.keyWindow() else { return }
    #if DUO_HINGE_SDK
    if #available(iOS 27.1, *) {
      tracker = HingeTracker(view: window) { [weak self] payload in self?.publish(payload) }
    }
    #endif
  }

  private static func keyWindow() -> UIWindow? {
    UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap { $0.windows }
      .first { $0.isKeyWindow }
  }
}

#if DUO_HINGE_SDK
// ⚠️ UNVERIFIED against Apple's SDK. Names come from secondary sources (see API_NOTES.md):
//    UIHingeInteraction, UIHinge.status/.angle (radians), UIView.reservedRegions(kind:options:),
//    ReservedRegion.frame/.isActive. Fix names here first when compiling with Xcode 27.1.
/// Invisible full-window view; its layoutSubviews runs after every window resize/rotation,
/// which is when reserved regions settle.
final class LayoutProbeView: UIView {
  var onLayout: (() -> Void)?
  override func layoutSubviews() {
    super.layoutSubviews()
    onLayout?()
  }
}

@available(iOS 27.1, *)
final class HingeTracker {
  private weak var view: UIView?
  private var interaction: UIHingeInteraction?
  private let probe = LayoutProbeView()
  private let onUpdate: ([String: Any]?) -> Void
  private var angleDegrees: Double = 180
  private var status: String = "unknown"

  init(view: UIView, onUpdate: @escaping ([String: Any]?) -> Void) {
    self.view = view
    self.onUpdate = onUpdate
    let interaction = UIHingeInteraction { [weak self] hinge in self?.handle(hinge) }
    view.addInteraction(interaction)
    self.interaction = interaction

    probe.frame = view.bounds
    probe.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    probe.isUserInteractionEnabled = false
    probe.isHidden = true
    probe.onLayout = { [weak self] in
      DispatchQueue.main.async { self?.emit() }
    }
    view.addSubview(probe)

    emit() // initial state, without waiting for the hinge to move
  }

  deinit {
    if let interaction { view?.removeInteraction(interaction) }
    probe.removeFromSuperview()
  }

  private func handle(_ hinge: UIHinge) {
    angleDegrees = Double(hinge.angle) * 180 / .pi
    switch hinge.status {
    case .closed: status = "closed"
    case .partiallyOpen: status = "partiallyOpen"
    case .fullyOpen: status = "fullyOpen"
    default: status = "unknown"
    }
    emit()
  }

  private func emit() {
    onUpdate([
      "angle": angleDegrees,
      "status": status,
      "innerDisplayActive": status != "closed",
      "foldRect": foldRect() ?? NSNull(),
    ])
  }

  private func foldRect() -> [String: Double]? {
    guard let view else { return nil }
    guard let region = view.reservedRegions(kind: .division, options: []).first(where: { $0.isActive })
    else { return nil }
    let r = view.convert(region.frame, to: nil)
    return ["x": r.origin.x, "y": r.origin.y, "width": r.size.width, "height": r.size.height]
  }
}
#endif
