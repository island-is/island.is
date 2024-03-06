import { resolve } from 'path'

export const rootDir = resolve(__dirname, '..', '..', '..')

export const COMMON_SECRETS = {
  CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY',
}
