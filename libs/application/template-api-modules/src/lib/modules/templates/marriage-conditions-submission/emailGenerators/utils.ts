import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../../../../../../libs/application/template-api-modules/src/lib/modules/templates/marriage-conditions-submission/emailGenerators/assets/${file}`,
    ).replace(/^\/+/, '')
  }

  return join(__dirname, `./marriage-conditions-assets/${file}`)
}
