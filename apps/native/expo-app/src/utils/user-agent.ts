import { Platform } from 'react-native'
import * as Application from 'expo-application';

export const getCustomUserAgent = () => {
  return [
    `IslandIsApp (${Application.nativeApplicationVersion})`,
    `Build/${Application.nativeBuildVersion}`,
    `(${Platform.OS}/${Platform.Version})`,
  ].join(' ')
}
