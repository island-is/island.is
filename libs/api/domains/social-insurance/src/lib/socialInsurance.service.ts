import { User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { SocialInsuranceAdministrationClientService } from '@island.is/clients/social-insurance-administration'
import {
  CmsElasticsearchService,
  CustomPageUniqueIdentifier,
} from '@island.is/cms'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import { PensionCalculationInput } from './dtos/pensionCalculation.input'
import { PensionCalculationResponse } from './models/pensionCalculation.model'
import {
  getPensionCalculationHighlightedItems,
  groupPensionCalculationItems,
  mapPensionCalculationInput,
} from './utils'
import { PaymentGroup } from './models/paymentGroup.model'
import { PaymentPlan } from './models/paymentPlan.model'
import { Payments } from './models/payments.model'
import { mapToPaymentGroupType } from './models/paymentGroupType.model'

@Injectable()
export class SocialInsuranceService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly socialInsuranceApi: SocialInsuranceAdministrationClientService,
    private readonly cmsElasticService: CmsElasticsearchService,
  ) {}

  async getPayments(user: User): Promise<Payments | undefined> {
    const [payments, years] = await Promise.all([
      this.socialInsuranceApi.getPayments(user),
      this.socialInsuranceApi.getValidYearsForPaymentPlan(user),
    ])

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
      paymentYears: years,
    }
  }

  async getPaymentPlan(
    user: User,
    year: number,
  ): Promise<PaymentPlan | undefined> {
    const paymentPlan = await this.socialInsuranceApi
      .getPaymentPlan(user, year)
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
  async getValidPaymentPlanYear(user: User): Promise<Array<number>> {
    return this.socialInsuranceApi.getValidYearsForPaymentPlan(user)
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
}
