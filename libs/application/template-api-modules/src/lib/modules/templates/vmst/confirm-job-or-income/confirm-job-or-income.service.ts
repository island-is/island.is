import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { VmstUnemploymentClientService } from '@island.is/clients/vmst-unemployment'
import { TemplateApiModuleActionProps } from '../../../../types'
import { errorMessages } from '@island.is/application/templates/vmst/confirm-job-or-income'
import { TemplateApiError } from '@island.is/nest/problem'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class ConfirmJobOrIncomeService extends BaseTemplateApiService {
  constructor(
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
    const entries = getValueViaPath<
      Array<
        Record<string, string> & {
          company?: { nationalId: string; name: string }
        }
      >
    >(answers, 'registerIncome')

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
      if (e instanceof TemplateApiError) {
        throw e
      }
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
