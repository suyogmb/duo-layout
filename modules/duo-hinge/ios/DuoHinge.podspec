Pod::Spec.new do |s|
  s.name           = 'DuoHinge'
  s.version        = '1.0.0'
  s.summary        = 'iPhone Duo hinge pose and fold region'
  s.description    = 'Reports hinge status/angle and the .division reserved region to JS.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  # Duo APIs need the iOS 27.1 SDK (Xcode 27.1+). Build with DUO_HINGE_SDK=1 to compile them in;
  # without it the module compiles everywhere and reports "no hinge".
  conditions = ENV['DUO_HINGE_SDK'] == '1' ? '$(inherited) DUO_HINGE_SDK' : '$(inherited)'
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_ACTIVE_COMPILATION_CONDITIONS' => conditions,
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
