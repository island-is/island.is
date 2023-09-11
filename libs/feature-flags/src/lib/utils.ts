import { ConfigCatModule } from './types'

export const getConfigCatModule = async (): Promise<ConfigCatModule> => {
  if (typeof window === 'undefined') {
    return import('configcat-node')
  } else {
    return import('configcat-js')
  }
}
