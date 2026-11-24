# duo-hinge — iOS API notes

Status: **UNVERIFIED** against the Apple SDK. Checked 2026-11-20. Apple's UIKit docs page didn't render
for the fetcher; this Mac has Xcode 27.0 (needs 27.1 for the Duo SDK).

## Names used in `ios/DuoHingeModule.swift` (inside `#if DUO_HINGE_SDK`)

| Symbol | Source | Notes |
|---|---|---|
| `UIHingeInteraction { hinge in }` | slekens.dev blog | Handler receives `UIHinge`. Initializer signature not shown. |
| `UIHinge.status` → `.closed / .partiallyOpen / .fullyOpen / .unknown` | slekens.dev; SwiftUI README (`DeviceHinge.status`) | Blog: treat `.unknown` as fully open. |
| `UIHinge.angle` | SwiftUI README (`Angle`); blog says radians in UIKit | Property name in UIKit unconfirmed. |
| `UIView.reservedRegions(kind:options:)` → `[UIView.ReservedRegion]` | slekens.dev | `.division` = fold, `.occlusion` = camera. |
| `ReservedRegion.frame`, `.margins`, `.isActive` | slekens.dev; SwiftUI README | `frame` includes margins (README). Arrives after first layout. |

SwiftUI equivalents (README, verbatim): `.onHingeChange { old, new in new.hinge }`,
`GeometryProxy.reservedRegions(kind: .division)`.

## Sources
- https://github.com/artemnovichkov/iPhone-Duo-by-Examples
- https://slekens.dev/en/blog/iphone-duo-xcode-27-1-six-foldable-apis/

## To enable on Xcode 27.1
1. `DUO_HINGE_SDK=1 npx expo run:ios`
2. Fix any symbol errors in the `#if DUO_HINGE_SDK` block. The JS contract (`RawHinge`) stays the same.
