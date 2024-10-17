import { BaseTemplateApiService } from '../../base-template-api.service'
import { Inject } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  CemeteryFinancialStatementValues,
  FinancialStatementsInaoClientService,
  ClientRoles,
} from '@island.is/clients/financial-statements-inao'
import {
  ApplicationTypes,
  ApplicationWithAttachments as Application,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { TemplateApiModuleActionProps } from '../../../types'
import * as kennitala from 'kennitala'
import {
  mapValuesToCemeterytype,
  getNeededCemeteryValues,
  mapContactsAnswersToContacts,
  mapDigitalSignee,
} from '../financial-statement-cemetery/mappers/mapValuesToUserType'
import { S3Service } from '@island.is/nest/aws'

export type AttachmentData = {
  key: string
  name: string
}

export interface DataResponse {
  success: boolean
  message?: string
}

export const getCurrentUserType = (
  answers: Application['answers'],
  externalData: Application['externalData'],
) => {
  const fakeUserType: any = getValueViaPath(answers, 'fakeData.options')

  const currentUserType: any = getValueViaPath(
    externalData,
    'getUserType.data.value',
  )
  return fakeUserType ?? currentUserType
}

export class FinancialStatementCemeteryTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private financialStatementClientService: FinancialStatementsInaoClientService,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.FINANCIAL_STATEMENT_CEMETERY)
  }

  private async getAttachments(application: Application): Promise<string> {
    const attachments: Array<AttachmentData> | undefined = getValueViaPath(
      application.answers,
      'attachments.files',
    ) as Array<{ key: string; name: string }>

    const attachmentKey = attachments[0].key

    const fileName = (
      application.attachments as {
        [key: string]: string
      }
    )[attachmentKey]

    if (!fileName) {
      return Promise.reject({})
    }

    try {
      const fileContent = await this.s3Service
        .getFileContent(fileName, 'base64')
      return fileContent || ''
    } catch (error) {
      throw new Error('Error occurred while fetching attachment')
    }
  }

  async getUserType({ auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth
    if (kennitala.isPerson(nationalId)) {
      return this.financialStatementClientService.getClientType(
        ClientRoles.Individual,
      )
    } else {
      return this.financialStatementClientService.getUserClientType(nationalId)
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { nationalId, actor } = auth
    const answers = application.answers
    const externalData = application.externalData
    const currentUserType = getCurrentUserType(answers, externalData)

    // Todo test before this goes live
    // if (currentUserType !== FSIUSERTYPE.CEMETRY) {
    //   throw new Error('Application submission failed')
    // }

    if (!actor) {
      return new Error('Enginn umboðsmaður fannst')
    }

    const values: CemeteryFinancialStatementValues =
      mapValuesToCemeterytype(answers)

    const { year, actorsName, contactsAnswer, clientPhone, clientEmail, file } =
      getNeededCemeteryValues(answers)

    const fileName = file ? await this.getAttachments(application) : undefined

    const client = { nationalId }

    const contacts = mapContactsAnswersToContacts(
      actor,
      actorsName,
      contactsAnswer,
    )
    const digitalSignee = mapDigitalSignee(clientEmail, clientPhone)

    const result: DataResponse = await this.financialStatementClientService
      .postFinancialStatementForCemetery(
        client,
        contacts,
        digitalSignee,
        year,
        '',
        values,
        fileName,
      )
      .then((data) => {
        if (data === true) {
          return { success: true }
        } else {
          return { success: false }
        }
      })
      .catch((e) => {
        return {
          success: false,
          errorMessages: e.message,
        }
      })

    if (!result.success) {
      throw new Error('Application submission failed')
    }

    return { success: result.success }
  }
}
