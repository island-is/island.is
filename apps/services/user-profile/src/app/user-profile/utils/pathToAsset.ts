import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(__dirname, `../../service-portal/assets/images/${file}`)
  }

  return join(__dirname, `./minarsidur/assets/images/${file}`)
}
