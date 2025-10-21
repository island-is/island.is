import { Application } from '@island.is/application/types'
import { SubmittedApplicationData } from '@island.is/application/templates/iceland-health/accident-notification'
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

export const whiteListedErrorCodes = [
  's801_fyrirt_kennit',
  's801_undirtegund',
  's801_tilkynnandi',
  's801_teg_tilk',
  's801_stads_skipa',
  's801_sly_timislys',
  's801_sly_tegund',
  's801_sly_dags',
  's801_fylgiskjal',
  's801_slasadi',
]

export const getApplicationDocumentId = (application: Application): number => {
  const subAppData = application.externalData
    .submitApplication as SubmittedApplicationData
  const documentId = subAppData?.data?.documentId
  if (!documentId) {
    throw new Error('No documentId found on application')
  }
  return documentId
}
