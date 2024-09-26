import DeviceInfo from 'react-native-device-info'
import compareVersions from 'compare-versions'
import { featureFlagClient } from '../contexts/feature-flag-provider'

export const needsToUpdateAppVersion = async (): Promise<boolean> => {
  const minimumVersionSupported = await featureFlagClient?.getValueAsync(
    'minimumSupportedAppVersion',
    '1.0.0',
  )

  if (!minimumVersionSupported) {
    return false
  }

  const currentVersion = DeviceInfo.getVersion()

  return compareVersions.compare(minimumVersionSupported, currentVersion, '>')
}
