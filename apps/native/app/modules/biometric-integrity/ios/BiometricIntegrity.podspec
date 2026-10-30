Pod::Spec.new do |s|
  s.name           = 'BiometricIntegrity'
  s.version        = '1.0.0'
  s.summary        = 'Detects changes to the enrolled biometrics on the device'
  s.description    = 'Detects changes to the enrolled biometrics on the device'
  s.author         = ''
  s.homepage       = 'https://island.is'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = '**/*.{h,m,mm,swift}'
end
