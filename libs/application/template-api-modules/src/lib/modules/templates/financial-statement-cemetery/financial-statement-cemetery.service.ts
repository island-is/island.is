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
import AmazonS3URI from 'amazon-s3-uri'
import { TemplateApiModuleActionProps } from '../../../types'
import * as kennitala from 'kennitala'
import {
  DataResponse,
  getCurrentUserType,
} from '../financial-statements-inao/financial-statements-inao.service'
import {
  mapValuesToCemeterytype,
  getNeededCemeteryValues,
  mapContactsAnswersToContacts,
  mapDigitalSignee,
} from '../financial-statement-cemetery/mappers/mapValuesToUserType'
import { AttachmentS3Service } from '../../shared/services'

export type AttachmentData = {
  key: string
  name: string
}

export class FinancialStatementCemeteryTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private financialStatementClientService: FinancialStatementsInaoClientService,
    private attachmentService: AttachmentS3Service,
  ) {
    super(ApplicationTypes.FINANCIAL_STATEMENT_CEMETERY)
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

    const fileName = file
    ? (await this.attachmentService.getFiles(application, ['attachments.files']))[0].fileContent
    : undefined

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
