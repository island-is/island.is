import { Injectable } from '@nestjs/common'
import {
  CemeteryFinancialStatementValues,
  FinancialStatementsInaoClientService,
  PersonalElectionFinancialStatementValues,
  PoliticalPartyFinancialStatementValues,
} from '@island.is/clients/financial-statements-inao'
import * as kennitala from 'kennitala'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  ApplicationWithAttachments as Application,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import AmazonS3URI from 'amazon-s3-uri'

import { S3 } from 'aws-sdk'
import {
  mapValuesToIndividualtype,
  mapValuesToPartytype,
  mapValuesToCemeterytype,
} from './mappers/mapValuesToUsertype'
import { USERTYPE } from './types'

const LESS = 'less'

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
  return fakeUserType ? fakeUserType : currentUserType
}

export interface DataResponse {
  success: boolean
  message?: string
}
@Injectable()
export class FinancialStatementsInaoTemplateService extends BaseTemplateApiService {
  s3: S3
  constructor(
    private financialStatementsClientService: FinancialStatementsInaoClientService,
  ) {
    super(ApplicationTypes.FINANCIAL_STATEMENTS_INAO)
    this.s3 = new S3()
  }

  private async getAttachment(application: Application): Promise<string> {
    const attachments: AttachmentData[] | undefined = getValueViaPath(
      application.answers,
      'attachments.file',
    ) as Array<{ key: string; name: string }>

    const attachmentKey = attachments[0].key

    const fileName = (application.attachments as {
      [key: string]: string
    })[attachmentKey]

    if (!fileName) {
      return Promise.reject({})
    }

    const { bucket, key } = AmazonS3URI(fileName)

    const uploadBucket = bucket
    try {
      const file = await this.s3
        .getObject({
          Bucket: uploadBucket,
          Key: key,
        })
        .promise()
      const fileContent = file.Body as Buffer
      return fileContent?.toString('base64') || ''
    } catch (error) {
      throw new Error('Villa kom kom upp við að senda umsókn')
    }
  }

  async getUserType({ auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth

    if (kennitala.isPerson(nationalId)) {
      return this.financialStatementsClientService.getClientType(
        'Einstaklingur',
      )
    } else {
      return this.financialStatementsClientService.getUserClientType(nationalId)
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { nationalId, actor } = auth
    const answers = application.answers
    const externalData = application.externalData
    const currentUserType = getCurrentUserType(answers, externalData)

    if (currentUserType === USERTYPE.INDIVIDUAL) {
      const values: PersonalElectionFinancialStatementValues = mapValuesToIndividualtype(
        answers,
      )

      const electionId = getValueViaPath(
        answers,
        'election.selectElection',
      ) as string
      const clientName = getValueViaPath(answers, 'about.fullName') as string
      const electionIncomeLimit = getValueViaPath(
        answers,
        'election.incomeLimit',
      ) as string

      const noValueStatement = electionIncomeLimit === LESS ? true : false

      const fileName = noValueStatement
        ? undefined
        : await this.getAttachment(application)

      const result: DataResponse = await this.financialStatementsClientService
        .postFinancialStatementForPersonalElection(
          nationalId,
          actor?.nationalId,
          electionId,
          noValueStatement,
          clientName,
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
            errorMessage: e.message,
          }
        })
      if (!result.success) {
        throw new Error(`Application submission failed`)
      }
      return { success: result.success }
    } else if (currentUserType === USERTYPE.PARTY) {
      const values: PoliticalPartyFinancialStatementValues = mapValuesToPartytype(
        answers,
      )
      const year = getValueViaPath(
        answers,
        'conditionalAbout.operatingYear',
      ) as string

      const fileName = await this.getAttachment(application)

      const result: DataResponse = await this.financialStatementsClientService
        .postFinancialStatementForPoliticalParty(
          nationalId,
          actor?.nationalId,
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
            errorMessage: e.message,
          }
        })
      if (!result.success) {
        throw new Error(`Application submission failed`)
      }
      return { success: result.success }
    } else if (currentUserType === USERTYPE.CEMETRY) {
      const values: CemeteryFinancialStatementValues = mapValuesToCemeterytype(
        answers,
      )
      const year = getValueViaPath(
        answers,
        'conditionalAbout.operatingYear',
      ) as string

      const file = getValueViaPath(answers, 'attachments.file')

      const fileName = file ? await this.getAttachment(application) : undefined

      const result: DataResponse = await this.financialStatementsClientService
        .postFinancialStatementForCemetery(
          nationalId,
          actor?.nationalId,
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
            errorMessage: e.message,
          }
        })
      if (!result.success) {
        throw new Error(`Application submission failed`)
      }
      return { success: result.success }
    }
  }
}
