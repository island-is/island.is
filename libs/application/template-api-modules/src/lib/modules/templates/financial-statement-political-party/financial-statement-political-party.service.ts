import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { S3 } from 'aws-sdk'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ApplicationTypes,
  ApplicationWithAttachments as Application,
} from '@island.is/application/types'
import {
  Contact,
  ContactType,
  DigitalSignee,
  FinancialStatementsInaoClientService,
  PoliticalPartyFinancialStatementValues,
} from '@island.is/clients/financial-statements-inao'
import { getValueViaPath } from '@island.is/application/core'
import AmazonS3Uri from 'amazon-s3-uri'
import { TemplateApiModuleActionProps } from '../../../types'
import * as kennitala from 'kennitala'
import { mapValuesToPartyTypes } from './mappers/mapValuesToPartyTypes'

export interface AttachmentData {
  key: string
  name: string
}

export interface DataResponse {
  success: boolean
  message?: string
}

export const getCurrentUserType = (answers: any, externalData: any) => {
  const fakeUserType: any = getValueViaPath(answers, 'fakeData.options')

  const currentUserType: any = getValueViaPath(
    externalData,
    'getUserType.data.value',
  )
  return fakeUserType ? fakeUserType : currentUserType
}

const PARTY_USER_TYPE = 150000001

@Injectable()
export class FinancialStatementPoliticalPartyTemplateService extends BaseTemplateApiService {
  s3: S3
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private financialStatementPoliticalPartyService: FinancialStatementsInaoClientService,
  ) {
    super(ApplicationTypes.FINANCIAL_STATEMENT_POLITICAL_PARTY)
    this.s3 = new S3()
  }

  private async getAttachment(application: Application): Promise<string> {
    const attachments: AttachmentData[] | undefined = getValueViaPath(
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

    const { bucket, key } = AmazonS3Uri(fileName)

    const uploadBucket = bucket
    try {
      const file = await this.s3
        .getObject({ Bucket: uploadBucket, Key: key })
        .promise()
      const fileContent = file.Body as Buffer
      return fileContent?.toString('base64') || ''
    } catch (error) {
      throw new Error('Villa kom upp við að senda umsókn')
    }
  }

  async getUserType({ auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth
    if (kennitala.isPerson(nationalId)) {
      return this.financialStatementPoliticalPartyService.getClientType(
        'Einstaklingur',
      )
    } else {
      return (
        this,
        this.financialStatementPoliticalPartyService.getUserClientType(
          nationalId,
        )
      )
    }
  }
  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { nationalId, actor } = auth

    if (!actor) {
      return new Error('Enginn umboðsmaður fannst')
    }

    const answers = application.answers
    const externalData = application.externalData
    const currentUserType = getCurrentUserType(answers, externalData)

    if (currentUserType !== PARTY_USER_TYPE) {
      throw new Error(`Application submission failed`)
    }

    const values: PoliticalPartyFinancialStatementValues =
      mapValuesToPartyTypes(answers)
    const year = getValueViaPath(
      answers,
      'conditionalAbout.operatingYear',
    ) as string

    const actorsName = getValueViaPath(
      answers,
      'about.powerOfAttorneyName',
    ) as string

    const clientPhone = getValueViaPath(answers, 'about.phoneNumber') as string

    const clientEmail = getValueViaPath(answers, 'about.email') as string

    const fileName = await this.getAttachment(application)

    const client = { nationalId }

    const contacts: Array<Contact> = [
      {
        nationalId: actor.nationalId,
        name: actorsName,
        contactType: ContactType.Actor,
      },
    ]

    const digitalSignee: DigitalSignee = {
      email: clientEmail,
      phone: clientPhone,
    }

    const result: DataResponse =
      await this.financialStatementPoliticalPartyService
        .postFinancialStatementForPoliticalParty(
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
            message: e.message,
          }
        })

    if (!result.success) {
      throw new Error('Application submission failed')
    }

    return { success: result.success }
  }
}
