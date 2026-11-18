Pod::Spec.new do |s|
  s.name           = 'DeviceKeys'
  s.version        = '1.0.0'
  s.summary        = 'Hardware-bound P-256 keys for device-bound auth'
  s.description    = 'Hardware-bound P-256 keys for device-bound auth'
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
