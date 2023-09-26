import { ComplaintsToAlthingiOmbudsmanAnswers } from '@island.is/application/templates/complaints-to-althingi-ombudsman'
import { Application } from '@island.is/application/types'
import {
  CreateCaseRequest,
  DocumentInfo,
} from '@island.is/clients/althingi-ombudsman'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../libs/application/template-api-modules/src/lib/modules/templates/complaints-to-althingi-ombudsman/emailGenerators/assets/${file}`,
    )
  }

  return join(__dirname, `./complaints-to-althingi-ombudsman-assets/${file}`)
}

export const applicaitonToCaseRequest = async (
  application: Application,
  attachments: DocumentInfo[],
): Promise<CreateCaseRequest> => {
  const answers = application.answers as ComplaintsToAlthingiOmbudsmanAnswers
  return {
    category: 'Kvörtun',
    subject: 'Kvörtun frá ísland.is',
    keywords: [],
    metadata: [],
    template: 'Kvörtun',
    contacts: [],
    documents: attachments,
  }
}
