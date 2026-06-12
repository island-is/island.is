import { Injectable, Inject } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { VmstUnemploymentClientService } from '@island.is/clients/vmst-unemployment'
import { TemplateApiModuleActionProps } from '../../../../types'
import { errorMessages } from '@island.is/application/templates/vmst/confirm-job-or-income'
import { TemplateApiError } from '@island.is/nest/problem'
import { getValueViaPath } from '@island.is/application/core'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { IncomeType } from './confirm-job-or-income.types'
import {
  buildIrregularJobRequest,
  buildPartTimeJobRequest,
  buildContractorJobRequest,
  buildCapitalIncomePaymentRequest,
  buildTRPaymentRequest,
  buildPensionPaymentRequest,
} from './confirm-job-or-income.utils'

@Injectable()
export class ConfirmJobOrIncomeService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
  ) {
    super(ApplicationTypes.CONFIRM_JOB_OR_INCOME)
  }

  async getCanReportWork({
    auth,
  }: TemplateApiModuleActionProps): Promise<{ canReportWork: boolean }> {
    let applicantId: string

    try {
      const result = await this.vmstUnemploymentClientService.resolveApplicant(
        auth,
      )
      applicantId = result.applicantId
    } catch (e) {
      this.logger.error(
        '[VMST-Confirm-Job-Or-Income] - Error checking eligibility',
        e,
      )
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.cannotApplyErrorSummary,
        },
        400,
      )
    }

    let canReportWork: boolean

    try {
      const actions =
        await this.vmstUnemploymentClientService.getApplicantActions(
          applicantId,
        )
      canReportWork = !!actions.canReportWork
    } catch (e) {
      this.logger.error(
        '[VMST-Confirm-Job-Or-Income] - Error fetching applicant actions',
        e,
      )
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.cannotApplyErrorSummary,
        },
        400,
      )
    }

    if (!canReportWork) {
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.cannotApplyErrorSummary,
        },
        400,
      )
    }

    return { canReportWork: true }
  }

  async getPensionFunds() {
    return await this.vmstUnemploymentClientService.getPensionFunds()
  }

  async getIncomeTypes() {
    const [trTypes, pensionTypes, capitalIncomeTypes] = await Promise.all([
      this.vmstUnemploymentClientService.getIncomeTypes({
        onlyTrTypes: true,
      }),
      this.vmstUnemploymentClientService.getIncomeTypes({
        onlyPensionTypes: true,
      }),
      this.vmstUnemploymentClientService.getIncomeTypes({
        onlyCapitalTypes: true,
      }),
    ])

    return { trTypes, pensionTypes, capitalIncomeTypes }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    let applicantId: string

    try {
      const result = await this.vmstUnemploymentClientService.resolveApplicant(
        auth,
      )
      applicantId = result.applicantId
    } catch (e) {
      this.logger.error(
        '[VMST-Confirm-Job-Or-Income] - Error getting applicant information',
        e,
      )
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.submitError,
        },
        500,
      )
    }

    const { answers } = application
    const typeOfIncome = getValueViaPath<string>(answers, 'typeOfIncome')

    const fieldIdMap: Record<string, string> = {
      [IncomeType.CASUAL_WORK]: 'registerCasualWork',
      [IncomeType.PART_TIME]: 'registerPartTime',
      [IncomeType.CONTRACT_WORK]: 'registerContractWork',
      [IncomeType.CAPITAL_INCOME]: 'registerCapitalIncome',
      [IncomeType.SOCIAL_INSURANCE]: 'registerSocialInsurance',
      [IncomeType.PENSION]: 'registerPension',
    }

    const fieldId = typeOfIncome ? fieldIdMap[typeOfIncome] : undefined
    const entries = getValueViaPath<
      Array<
        Record<string, string> & {
          company?: { nationalId: string; name: string }
        }
      >
    >(answers, fieldId ?? '')

    if (!entries || entries.length === 0) {
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.submitError,
        },
        400,
      )
    }

    try {
      switch (typeOfIncome) {
        case IncomeType.CASUAL_WORK: {
          for (const entry of entries) {
            await this.vmstUnemploymentClientService.createIrregularJob(
              buildIrregularJobRequest(entry, applicantId),
            )
          }
          break
        }

        case IncomeType.PART_TIME: {
          for (const entry of entries) {
            await this.vmstUnemploymentClientService.createPartTimeJob(
              buildPartTimeJobRequest(entry, applicantId),
            )
          }
          break
        }

        case IncomeType.CONTRACT_WORK: {
          for (const entry of entries) {
            await this.vmstUnemploymentClientService.createContractorJob(
              buildContractorJobRequest(entry, applicantId),
            )
          }
          break
        }

        case IncomeType.CAPITAL_INCOME: {
          for (const entry of entries) {
            await this.vmstUnemploymentClientService.createCapitalIncomePayment(
              buildCapitalIncomePaymentRequest(entry, applicantId),
            )
          }
          break
        }

        case IncomeType.SOCIAL_INSURANCE: {
          for (const entry of entries) {
            await this.vmstUnemploymentClientService.createTRPayment(
              buildTRPaymentRequest(entry, applicantId),
            )
          }
          break
        }

        case IncomeType.PENSION: {
          for (const entry of entries) {
            await this.vmstUnemploymentClientService.createPensionPayment(
              buildPensionPaymentRequest(entry, applicantId),
            )
          }
          break
        }

        default:
          throw new TemplateApiError(
            {
              title: errorMessages.cannotApplyErrorTitle,
              summary: errorMessages.cannotApplyErrorSummary,
            },
            400,
          )
      }
    } catch (e) {
      this.logger.error(
        '[VMST-Confirm-Job-Or-Income] - Error submitting job or income information',
      )
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.submitError,
        },
        500,
      )
    }
  }
}
