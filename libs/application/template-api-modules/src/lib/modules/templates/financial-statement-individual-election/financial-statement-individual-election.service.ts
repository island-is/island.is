import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { S3 } from 'aws-sdk'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  ApplicationTypes,
  ApplicationWithAttachments as Application,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import AmazonS3Uri from 'amazon-s3-uri'
import { TemplateApiModuleActionProps } from '../../../types'
import { FinancialStatementsInaoClientService } from '@island.is/clients/financial-statements-inao'
import { DataResponse } from '../financial-statements-inao/financial-statements-inao.service'
import { getInput, getShouldGetFileName } from './mappers/helpers'

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
  s3: S3
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private financialStatementIndividualClientService: FinancialStatementsInaoClientService,
  ) {
    super(ApplicationTypes.FINANCIAL_STATEMENT_INDIVIDUAL_ELECTION)
    this.s3 = new S3()
  }

  private async getAttachment(application: Application): Promise<string> {
    const attachments: AttachmentData[] | undefined = getValueViaPath(
      application.answers,
      'attachments.file',
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

    const { bucket, key } = AmazonS3Uri(fileName)

    try {
      const file = await this.s3
        .getObject({
          Bucket: bucket,
          Key: key,
        })
        .promise()
      const fileContent = file.Body as Buffer
      return fileContent.toString('base64') || ''
    } catch (error) {
      throw new Error('Villa kom upp við að senda umsókn')
    }
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
      ? await this.getAttachment(application)
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
