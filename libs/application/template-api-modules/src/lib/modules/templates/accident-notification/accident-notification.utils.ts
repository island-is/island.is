import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../libs/application/template-api-modules/src/lib/modules/templates/accident-notification/emailGenerators/assets/${file}`,
    )
  }

  return join(__dirname, `./accident-notification-assets/${file}`)
}
