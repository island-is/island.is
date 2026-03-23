import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../../../../../../libs/application/template-api-modules/src/lib/modules/templates/transport-authority/driving-license-submission/emailGenerators/assets/${file}`,
    ).replace(/^\/+/, '')
  }

  return join(__dirname, `./driving-license-assets/${file}`)
}
