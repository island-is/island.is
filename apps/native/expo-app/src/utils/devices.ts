import { Platform } from 'react-native'

export const isIos = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'

const getIosMajorVersion = () => {
  if (!isIos) {
    return undefined
  }

  const version = `${Platform.Version}`.split('.')[0]
  const parsed = Number.parseInt(version, 10)

  return Number.isNaN(parsed) ? undefined : parsed
}

export const iosMajorVersion = getIosMajorVersion()

export const isIosLiquidGlassEnabled =
  typeof iosMajorVersion === 'number' && iosMajorVersion >= 26
