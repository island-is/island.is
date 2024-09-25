import DeviceInfo from 'react-native-device-info'
import compareVersions from 'compare-versions'

export const needsToUpdateAppVersion = async (): Promise<boolean> => {
  const minimumVersionSupported = '1.4.2' // TODO: Get from api

  const currentVersion = DeviceInfo.getVersion()

  return compareVersions.compare(minimumVersionSupported, currentVersion, '>')
}
