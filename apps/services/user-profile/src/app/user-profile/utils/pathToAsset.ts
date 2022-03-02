import { join } from 'path'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(__dirname, `./assets/images/${file}`)
  }

  return join(__dirname, `./images/${file}`)
}
