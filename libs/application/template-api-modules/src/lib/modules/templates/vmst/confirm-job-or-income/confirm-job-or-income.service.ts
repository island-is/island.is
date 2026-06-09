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

    const actions =
      await this.vmstUnemploymentClientService.getApplicantActions(applicantId)

    if (!actions.canReportWork) {
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
    const [trTypes, pensionTypes, allTypes] = await Promise.all([
      this.vmstUnemploymentClientService.getIncomeTypes({
        onlyTrTypes: true,
      }),
      this.vmstUnemploymentClientService.getIncomeTypes({
        onlyPensionTypes: true,
      }),
      this.vmstUnemploymentClientService.getIncomeTypes(),
    ])

    const trTypeIds = new Set(trTypes.map((t) => t.id))
    const pensionTypeIds = new Set(pensionTypes.map((t) => t.id))
    const capitalIncomeTypes = allTypes.filter(
      (t) => !trTypeIds.has(t.id) && !pensionTypeIds.has(t.id),
    )

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
      casualWork: 'registerCasualWork',
      partTime: 'registerPartTime',
      contractWork: 'registerContractWork',
      capitalIncome: 'registerCapitalIncome',
      socialInsurance: 'registerSocialInsurance',
      pension: 'registerPension',
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
        case 'casualWork': {
          for (const entry of entries) {
            await this.vmstUnemploymentClientService.createIrregularJob({
              applicantId,
              galdurExternalDomainRequestsIncomeCreateIrregularJobRequest: {
                employerSSN: entry.company?.nationalId?.replace('-', ''),
                periodFrom: entry.monthFrom
                  ? new Date(entry.monthFrom)
                  : undefined,
                periodTo: entry.monthTo ? new Date(entry.monthTo) : undefined,
                estimatedIncome: entry.estimatedIncome
                  ? Number(entry.estimatedIncome)
                  : undefined,
              },
            })
          }
          break
        }

        case 'partTime': {
          for (const entry of entries) {
            await this.vmstUnemploymentClientService.createPartTimeJob({
              applicantId,
              galdurExternalDomainRequestsIncomeCreatePartTimeJobRequest: {
                employerSSN: entry.company?.nationalId?.replace('-', ''),
                periodFrom: entry.jobStart
                  ? new Date(entry.jobStart)
                  : undefined,
                ratio: entry.workPercentage
                  ? Number(entry.workPercentage)
                  : undefined,
                estimatedIncome: entry.estimatedIncome
                  ? Number(entry.estimatedIncome)
                  : undefined,
              },
            })
          }
          break
        }

        case 'contractWork': {
          for (const entry of entries) {
            await this.vmstUnemploymentClientService.createContractorJob({
              applicantId,
              galdurExternalDomainRequestsIncomeCreateContractorJobRequest: {
                periodFrom: entry.contractJobStart
                  ? new Date(entry.contractJobStart)
                  : undefined,
                periodTo: entry.workEnds ? new Date(entry.workEnds) : undefined,
              },
            })
          }
          break
        }

        case 'capitalIncome': {
          for (const entry of entries) {
            await this.vmstUnemploymentClientService.createCapitalIncomePayment(
              {
                applicantId,
                galdurExternalDomainRequestsIncomeCreateCapitalIncomePaymentRequest:
                  {
                    description: entry.paymentType,
                    estimatedIncome: entry.amountPerMonth
                      ? Number(entry.amountPerMonth)
                      : undefined,
                    periodFrom: entry.periodFrom
                      ? new Date(entry.periodFrom)
                      : undefined,
                    periodTo:
                      entry.paymentFrequency === 'oneTime' ? null : undefined,
                  },
              },
            )
          }
          break
        }

        case 'socialInsurance': {
          for (const entry of entries) {
            await this.vmstUnemploymentClientService.createTRPayment({
              applicantId,
              galdurExternalDomainRequestsIncomeCreateTRPaymentRequest: {
                typeId: entry.socialPaymentType,
                estimatedIncome: entry.amountPerMonth
                  ? Number(entry.amountPerMonth)
                  : undefined,
                periodFrom: entry.periodFrom
                  ? new Date(entry.periodFrom)
                  : undefined,
                periodTo:
                  entry.paymentFrequency === 'oneTime' ? null : undefined,
              },
            })
          }
          break
        }

        case 'pension': {
          for (const entry of entries) {
            await this.vmstUnemploymentClientService.createPensionPayment({
              applicantId,
              galdurExternalDomainRequestsIncomeCreatePensionPaymentRequest: {
                typeId: entry.pensionType,
                pensionFundId: entry.pensionFund,
                estimatedIncome: entry.amountPerMonth
                  ? Number(entry.amountPerMonth)
                  : undefined,
              },
            })
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
