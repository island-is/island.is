import { BaseTemplateApiService } from '../../../base-template-api.service'
import { Inject } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  CemeteryFinancialStatementValues,
  FinancialStatementsInaoClientService,
} from '@island.is/clients/financial-statements-inao'
import {
  ApplicationTypes,
  ApplicationWithAttachments as Application,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { TemplateApiModuleActionProps } from '../../../../types'
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
  _answers: Application['answers'],
  externalData: Application['externalData'],
) => {
  const currentUserType = getValueViaPath<number>(
    externalData,
    'getUserType.data.value',
  )
  return currentUserType
}

export class FinancialStatementCemeteryTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private financialStatementClientService: FinancialStatementsInaoClientService,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.FINANCIAL_STATEMENT_CEMETERY)
  }

  private async getAttachmentsAsBase64(
    application: Application,
  ): Promise<string> {
    const attachments: Array<AttachmentData> | undefined = getValueViaPath<
      Array<{ key: string; name: string }>
    >(application.answers, 'attachments.file')

    if (!attachments) {
      throw new Error('No attachments found')
    }

    const attachmentKey = attachments[0].key

    const fileName = (
      application.attachments as {
        [key: string]: string
      }
    )[attachmentKey]

    if (!fileName) {
      throw new Error(
        `Attachment filename not found in application on attachment key: ${attachmentKey}`,
      )
    }

    try {
      const fileContent = await this.s3Service.getFileContent(
        fileName,
        'base64',
      )

      if (!fileContent) {
        throw new Error(`File content not found for: ${fileName}`)
      }

      return fileContent
    } catch (error) {
      throw new Error(`Failed to retrieve attachment: ${error.message}`)
    }
  }

  async getUserType({ auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth
    if (kennitala.isPerson(nationalId)) {
      return null
    } else {
      return this.financialStatementClientService.getUserClientType(nationalId)
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { nationalId, actor } = auth
    const { answers } = application

    if (!actor) {
      return new Error('Enginn umboðsmaður fannst')
    }

    const { year, actorsName, contactsAnswer, clientPhone, clientEmail } =
      getNeededCemeteryValues(answers)

    if (!clientEmail || !clientPhone || !actorsName || !year) {
      throw new Error('Missing required values')
    }

    const client = { nationalId }
    const contacts = mapContactsAnswersToContacts(
      actor,
      actorsName,
      contactsAnswer,
    )
    const digitalSignee = mapDigitalSignee(clientEmail, clientPhone)
    const values = this.prepareValues(application)
    const fileName = await this.getAttachmentsAsBase64(application)

    try {
      const result =
        await this.financialStatementClientService.postFinancialStatementForCemetery(
          client,
          contacts,
          digitalSignee,
          year,
          '',
          values,
          fileName,
        )

      if (!result) {
        throw new Error('Application submission failed')
      }

      return { success: true }
    } catch (error) {
      this.logger.error('Error submitting application', error)
      return {
        success: false,
        message: error.message,
      }
    }
  }

  private prepareValues(
    application: Application,
  ): CemeteryFinancialStatementValues {
    return mapValuesToCemeterytype(application.answers)
  }
}
