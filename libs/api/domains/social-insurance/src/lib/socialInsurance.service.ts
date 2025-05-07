import { User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import {
  SocialInsuranceAdministrationClientService,
  TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto,
  IncomePlanStatus as IncomeStatus,
} from '@island.is/clients/social-insurance-administration'
import {
  CmsElasticsearchService,
  CustomPageUniqueIdentifier,
} from '@island.is/cms'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import { PensionCalculationInput } from './dtos/pensionCalculation.input'
import { PensionCalculationResponse } from './models/pension/pensionCalculation.model'
import {
  getPensionCalculationHighlightedItems,
  groupPensionCalculationItems,
  mapPensionCalculationInput,
} from './utils'
import { PaymentGroup } from './models/payments/paymentGroup.model'
import { PaymentPlan } from './models/payments/paymentPlan.model'
import { Payments } from './models/payments/payments.model'
import { mapToPaymentGroupType } from './models/payments/paymentGroupType.model'
import { IncomePlan } from './models/income/incomePlan.model'
import { IncomePlanStatus, LOG_CATEGORY } from './socialInsurance.type'
import { IncomePlanEligbility } from './models/income/incomePlanEligibility.model'
import { TemporaryCalculationInput } from './dtos/temporaryCalculation.input'

@Injectable()
export class SocialInsuranceService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly socialInsuranceApi: SocialInsuranceAdministrationClientService,
    private readonly cmsElasticService: CmsElasticsearchService,
  ) {}

  async getPayments(user: User): Promise<Payments | undefined> {
    const payments = await this.socialInsuranceApi
      .getPayments(user)
      .catch(handle404)

    if (!payments) {
      return undefined
    }

    //if no data
    if (!payments.nextPayment && !payments.previousPayment) {
      return undefined
    }

    return {
      nextPayment: payments.nextPayment ?? undefined,
      previousPayment: payments.previousPayment ?? undefined,
    }
  }

  async getPaymentPlan(user: User): Promise<PaymentPlan | undefined> {
    const paymentPlan = await this.socialInsuranceApi
      .getPaymentPlan(user)
      .catch(handle404)

    if (!paymentPlan) {
      return undefined
    }

    const paymentGroups: Array<PaymentGroup> =
      paymentPlan?.groups
        ?.map((g) => {
          if (!g.group) {
            return null
          }

          return {
            type: mapToPaymentGroupType(g.groupId ?? undefined),
            name: g.group,
            totalYearCumulativeAmount: g.total ?? 0,
            monthlyPaymentHistory:
              g.monthTotals
                ?.map((mt) => {
                  if (!mt.month) {
                    return null
                  }
                  return {
                    monthIndex: mt.month,
                    amount: mt.amount ?? 0,
                  }
                })
                .filter(isDefined) ?? [],
            payments:
              g.rows
                ?.map((r) => {
                  if (!r.name) {
                    return null
                  }
                  return {
                    name: r.name,
                    totalYearCumulativeAmount: r.total ?? 0,
                    markWithAsterisk: r.markWithAsterisk ?? undefined,
                    monthlyPaymentHistory:
                      r.months
                        ?.map((m) => {
                          if (!m.month) {
                            return null
                          }
                          return {
                            monthIndex: m.month,
                            amount: m.amount ?? 0,
                          }
                        })
                        .filter(isDefined) ?? [],
                  }
                })
                .filter(isDefined) ?? [],
          }
        })
        .filter(isDefined) ?? []

    if (!paymentGroups.length) {
      return undefined
    }

    return {
      totalPayments: paymentPlan.totalPayment ?? undefined,
      totalPaymentsReceived: paymentPlan.paidOut ?? undefined,
      totalPaymentsSubtraction: paymentPlan.subtracted ?? undefined,
      paymentGroups,
    }
  }

  async getIncomePlan(user: User): Promise<IncomePlan | undefined> {
    const data = await this.socialInsuranceApi.getLatestIncomePlan(user)

    if (!data?.registrationDate || !data?.status || !data.incomeTypeLines) {
      this.logger.info('Income plan incomplete, returning', {
        category: LOG_CATEGORY,
      })
      return
    }

    let hasIncompleteLines = false
    const incomeCategories = data.incomeTypeLines
      .map((i) => {
        if (!i.incomeTypeName || !i.incomeCategoryName || !i.totalSum) {
          hasIncompleteLines = true
          return undefined
        }
        return {
          name: i.incomeCategoryName,
          typeName: i.incomeTypeName,
          annualSum: i.totalSum,
          currency: i.currency ?? undefined,
        }
      })
      .filter(isDefined)

    if (hasIncompleteLines) {
      this.logger.info(
        'Income category data filtered out some incomplete lines',
        {
          category: LOG_CATEGORY,
        },
      )
    }

    return {
      registrationDate: data.registrationDate,
      status: this.parseIncomePlanStatus(data.status),
      incomeCategories,
    }
  }

  async getIncomePlanChangeEligibility(
    user: User,
  ): Promise<IncomePlanEligbility> {
    const data = await this.socialInsuranceApi.getIsEligible(user, 'incomeplan')

    return {
      isEligible: data.isEligible ?? undefined,
      reason: data.reason ?? undefined,
    }
  }

  async getPensionCalculation(
    input: PensionCalculationInput,
  ): Promise<PensionCalculationResponse> {
    const pageData = await this.cmsElasticService.getCustomPage({
      lang: 'is',
      uniqueIdentifier: CustomPageUniqueIdentifier.PensionCalculator,
    })

    const mappedInput = mapPensionCalculationInput(input, pageData)
    const calculation = await this.socialInsuranceApi.getPensionCalculation(
      mappedInput,
    )

    const groups = groupPensionCalculationItems(calculation, pageData)
    const highlightedItems = getPensionCalculationHighlightedItems(
      calculation,
      pageData,
    )

    return {
      highlightedItems,
      groups,
    }
  }

  async getTemporaryCalculations(
    user: User,
    input: TemporaryCalculationInput,
  ): Promise<TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto> {
    return await this.socialInsuranceApi.getTemporaryCalculations(user, input)
  }

  parseIncomePlanStatus = (status: IncomeStatus): IncomePlanStatus => {
    switch (status) {
      case 'Accepted':
        return IncomePlanStatus.ACCEPTED
      case 'InProgress':
        return IncomePlanStatus.IN_PROGRESS
      case 'Cancelled':
        return IncomePlanStatus.CANCELLED
      default:
        return IncomePlanStatus.UNKNOWN
    }
  }
}
