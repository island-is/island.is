import { Inject, Injectable } from '@nestjs/common'
import {
  CemeteryFinancialStatementValues,
  Client,
  Contact,
  ContactType,
  DigitalSignee,
  FinancialStatementsInaoClientService,
  PersonalElectionFinancialStatementValues,
  PersonalElectionSubmitInput,
  PoliticalPartyFinancialStatementValues,
} from '@island.is/clients/financial-statements-inao'
import {
  BoardMember,
  FSIUSERTYPE,
  LESS,
} from '@island.is/application/templates/financial-statements-inao/types'
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
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

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
    @Inject(LOGGER_PROVIDER) private logger: Logger,
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

    const fileName = (
      application.attachments as {
        [key: string]: string
      }
    )[attachmentKey]

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

    if (currentUserType === FSIUSERTYPE.INDIVIDUAL) {
      const electionIncomeLimit = getValueViaPath(
        answers,
        'election.incomeLimit',
      ) as string
      const noValueStatement = electionIncomeLimit === LESS ? true : false
      const values: PersonalElectionFinancialStatementValues | undefined =
        noValueStatement ? undefined : mapValuesToIndividualtype(answers)

      const electionId = getValueViaPath(
        answers,
        'election.selectElection',
      ) as string
      const clientName = getValueViaPath(answers, 'about.fullName') as string
      const clientPhone = getValueViaPath(
        answers,
        'about.phoneNumber',
      ) as string
      const clientEmail = getValueViaPath(answers, 'about.email') as string

      const fileName = noValueStatement
        ? undefined
        : await this.getAttachment(application)

      this.logger.info(
        `PostFinancialStatementForPersonalElection => clientNationalId: '${nationalId}', actorNationalId: '${
          actor?.nationalId
        }', electionId: '${electionId}', noValueStatement: '${noValueStatement}', clientName: '${clientName}', values: '${JSON.stringify(
          values,
        )}', file length: '${fileName?.length}'`,
      )

      const client: Client = {
        nationalId: nationalId,
        name: clientName,
        phone: clientPhone,
        email: clientEmail,
      }

      const actorContact: Contact | undefined = actor
        ? {
            nationalId: actor.nationalId,
            name: clientName,
            contactType: ContactType.Actor,
          }
        : undefined

      const digitalSignee: DigitalSignee = {
        email: clientEmail,
        phone: clientPhone,
      }

      const input: PersonalElectionSubmitInput = {
        client: client,
        actor: actorContact,
        digitalSignee: digitalSignee,
        electionId: electionId,
        noValueStatement: noValueStatement,
        values: values,
        file: fileName,
      }

      this.logger.info(`PostFinancialStatementForPersonalElection input`, input)
      this.logger.info(
        `PostFinancialStatementForPersonalElection file type ${typeof fileName}`,
      )

      this.logger.info(
        `PostFinancialStatementForPersonalElection method type, ${typeof this
          .financialStatementsClientService
          .postFinancialStatementForPersonalElection}`,
      )

      const result: DataResponse = await this.financialStatementsClientService
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
        throw new Error(`Application submission failed`)
      }
      return { success: result.success }
    } else if (currentUserType === FSIUSERTYPE.PARTY) {
      const values: PoliticalPartyFinancialStatementValues =
        mapValuesToPartytype(answers)
      const year = getValueViaPath(
        answers,
        'conditionalAbout.operatingYear',
      ) as string

      const actorsName = getValueViaPath(
        answers,
        'about.powerOfAttorneyName',
      ) as string
      const clientPhone = getValueViaPath(
        answers,
        'about.phoneNumber',
      ) as string
      const clientEmail = getValueViaPath(answers, 'about.email') as string

      const fileName = await this.getAttachment(application)

      const client = {
        nationalId: nationalId,
      }

      if (!actor) {
        return new Error('Enginn umboðsmaður fannst.')
      }

      const contacts: Contact[] = [
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

      const result: DataResponse = await this.financialStatementsClientService
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
            errorMessage: e.message,
          }
        })
      if (!result.success) {
        throw new Error(`Application submission failed`)
      }
      return { success: result.success }
    } else if (currentUserType === FSIUSERTYPE.CEMETRY) {
      const values: CemeteryFinancialStatementValues =
        mapValuesToCemeterytype(answers)
      const year = getValueViaPath(
        answers,
        'conditionalAbout.operatingYear',
      ) as string

      const actorsName = getValueViaPath(
        answers,
        'about.powerOfAttorneyName',
      ) as string
      const contactsAnswer = getValueViaPath(
        answers,
        'cemetryCaretaker',
      ) as BoardMember[]

      const clientPhone = getValueViaPath(
        answers,
        'about.phoneNumber',
      ) as string
      const clientEmail = getValueViaPath(answers, 'about.email') as string

      const file = getValueViaPath(answers, 'attachments.file')

      const fileName = file ? await this.getAttachment(application) : undefined

      const client = {
        nationalId: nationalId,
      }

      if (!actor) {
        return new Error('Enginn umboðsmaður fannst.')
      }

      const contacts: Contact[] = [
        {
          nationalId: actor.nationalId,
          name: actorsName,
          contactType: ContactType.Actor,
        },
      ]

      if (contactsAnswer) {
        contactsAnswer.map((x) => {
          const contact: Contact = {
            nationalId: x.nationalId,
            name: x.name,
            contactType:
              x.role === 'Stjórnarmaður'
                ? ContactType.BoardMember
                : ContactType.Inspector,
          }
          contacts.push(contact)
        })
      }

      const digitalSignee: DigitalSignee = {
        email: clientEmail,
        phone: clientPhone,
      }

      const result: DataResponse = await this.financialStatementsClientService
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
            errorMessage: e.message,
          }
        })
      if (!result.success) {
        throw new Error(`Application submission failed`)
      }
      return { success: result.success }
    } else {
      throw new Error(`Application submission failed`)
    }
  }
}
