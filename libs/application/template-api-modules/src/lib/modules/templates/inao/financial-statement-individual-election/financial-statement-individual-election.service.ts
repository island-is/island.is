import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  ApplicationTypes,
  ApplicationWithAttachments as Application,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { TemplateApiModuleActionProps } from '../../../../types'
import { FinancialStatementsInaoClientService } from '@island.is/clients/financial-statements-inao'
import { getInput, getShouldGetFileName } from './mappers/helpers'
import { S3Service } from '@island.is/nest/aws'
import { ELECTION_SPENDING_LIMIT_FALLBACK } from './constants'
import { FSIUSERTYPE } from '@island.is/application/templates/financial-statement-individual-election'
export interface AttachmentData {
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
  const currentUserType = getValueViaPath<number>(
    externalData,
    'getUserType.data.value',
  )
  return currentUserType
}

@Injectable()
export class FinancialStatementIndividualElectionService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private financialStatementIndividualClientService: FinancialStatementsInaoClientService,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.FINANCIAL_STATEMENT_INDIVIDUAL_ELECTION)
  }

  private async getAttachmentAsBas64(
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

  async getUserType() {
    return this.financialStatementIndividualClientService.getClientType(
      'Einstaklingur',
    )
  }

  async fetchElections({ application }: TemplateApiModuleActionProps) {
    const nationalId = getValueViaPath<string>(
      application.externalData,
      'identity.data.nationalId',
    )

    if (!nationalId) {
      throw new Error('National ID not found')
    }

    try {
      const elections =
        await this.financialStatementIndividualClientService.getElections(
          nationalId,
        )
      const electionLimits =
        await this.financialStatementIndividualClientService.getAllClientFinancialLimits(
          FSIUSERTYPE.INDIVIDUAL,
        )

      if (!elections || !electionLimits) {
        throw new Error('Elections or limits not found')
      }

      const electionsWithLimits = elections.map((election) => {
        const year = new Date(election.electionDate).getFullYear()
        const limit = electionLimits.find((limit) => limit.year === year)
        return {
          ...election,
          limit: limit?.limit ?? ELECTION_SPENDING_LIMIT_FALLBACK,
        }
      })

      return electionsWithLimits
    } catch (error) {
      console.error('Error fetching elections', error)
      throw new Error(`Failed to fetch elections: ${error.message}`)
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth
    const { answers } = application
    const shouldGetFileName = getShouldGetFileName(answers)
    const fileName = shouldGetFileName
      ? await this.getAttachmentAsBas64(application)
      : undefined

    const { input, loggerInfo } = getInput(answers, nationalId, fileName)

    this.logger.info(loggerInfo)
    this.logger.info(`PostFinancialStatementForPersonalElection input`, input)
    this.logger.info(
      `PostFinancialStatementForPersonalElection file type ${typeof fileName}`,
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
