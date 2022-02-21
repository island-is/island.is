import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'

export const pathToAsset = (file: string, baseUrl: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(__dirname, `../../service-portal/assets/images/${file}`)
  }

  return `${baseUrl}/assets/images/${file}`
}
