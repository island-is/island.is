import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

export const getCustomUserAgent = () => {
  return [
    `IslandIsApp (${DeviceInfo.getVersion()})`,
    `Build/${DeviceInfo.getBuildNumber()}`,
    `(${Platform.OS}/${Platform.Version})`,
  ].join(' ')
}
