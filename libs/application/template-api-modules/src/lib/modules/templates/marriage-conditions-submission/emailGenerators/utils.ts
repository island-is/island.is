import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    const assetPath = join(
      __dirname.replace(/\.\.\//g, ''),
      `assets/${file}`,
    ).replace(/^\/+/, '')
    return assetPath
  }

  return join(__dirname, `./marriage-conditions-assets/${file}`)
}
