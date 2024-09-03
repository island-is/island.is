import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  ApplicationTypes,
  ApplicationWithAttachments as Application,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { TemplateApiModuleActionProps } from '../../../types'
import { FinancialStatementsInaoClientService } from '@island.is/clients/financial-statements-inao'
import { DataResponse } from '../financial-statements-inao/financial-statements-inao.service'
import { getInput, getShouldGetFileName } from './mappers/helpers'
import { AttachmentS3Service } from '../../shared/services'

export interface AttachmentData {
  key: string
  name: string
}

export const getCurrentUserType = (answers: any, externalData: any) => {
  const fakeUserType: any = getValueViaPath(answers, 'fakeData.options')

  const currentUserType: any = getValueViaPath(
    externalData,
    'getUserType.data.value',
  )
  return fakeUserType ?? currentUserType
}

@Injectable()
export class FinancialStatementIndividualElectionService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private financialStatementIndividualClientService: FinancialStatementsInaoClientService,
    @Inject(AttachmentS3Service)
    private attachmentService: AttachmentS3Service,
  ) {
    super(ApplicationTypes.FINANCIAL_STATEMENT_INDIVIDUAL_ELECTION)
  }

  async getUserType() {
    return this.financialStatementIndividualClientService.getClientType(
      'Einstaklingur',
    )
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { nationalId, actor } = auth
    const { answers } = application
    const shouldGetFileName = getShouldGetFileName(answers)
    const fileName = shouldGetFileName
      ? (
          await this.attachmentService.getFiles(application, [
            'attachments.file',
          ])
        )[0].fileContent
      : undefined

    const { input, loggerInfo } = getInput(answers, actor, nationalId, fileName)

    this.logger.info(loggerInfo)
    this.logger.info(`PostFinancialStatementForPersonalElection input`, input)
    this.logger.info(
      `PostFinancialStatementForPersonalElection file type ${typeof fileName}`,
    )
    this.logger.info(
      `PostFinancialStatementForPersonalElection method type, ${typeof this
        .financialStatementIndividualClientService
        .postFinancialStatementForPersonalElection}`,
    )

    const result: DataResponse =
      await this.financialStatementIndividualClientService
        .postFinancialStatementForPersonalElection(input)
        .then((data) => {
          if (data === true) {
            return { success: true }
          } else {
            return { success: false }
          }
        })
        .catch((e) => {
          this.logger.error(
            'Failed to post financial statement for personal election',
            e,
          )
          return {
            success: false,
            errorMessage: e.message,
          }
        })

    if (!result.success) {
      throw new Error('Application submission failed')
    }
    return { success: result.success }
  }
}
