import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { SocialInsuranceAdministrationClientService } from '@island.is/clients/social-insurance-administration'
import { User } from '@island.is/auth-nest-tools'
import { PaymentPlan } from './models/paymentPlan.model'
import { handle404 } from '@island.is/clients/middlewares'
import { PaymentGroup } from './models/paymentGroup'
import { isDefined } from '@island.is/shared/utils'
import addYears from 'date-fns/addYears'

@Injectable()
export class SocialInsuranceService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly socialInsuranceApi: SocialInsuranceAdministrationClientService,
  ) {}

  async getPaymentPlan(
    user: User,
    year?: number,
  ): Promise<PaymentPlan | undefined> {
    const [paymentPlan, payments] = await Promise.all([
      this.socialInsuranceApi
        .getPaymentPlan(user, year ?? addYears(new Date(), -1).getFullYear())
        .catch(handle404),
      this.socialInsuranceApi.getPayments(user).catch(handle404),
    ])

    if (!paymentPlan && !payments) {
      return undefined
    }

    const paymentGroups: Array<PaymentGroup> =
      paymentPlan?.paymentPlan?.groups
        ?.map((g) => {
          if (!g.group) {
            return null
          }
          return {
            type: g.group,
            totalYearCumulativeAmount: g.monthTotals?.reduce(
              (total, current) => (total += current.amount ?? 0),
              0,
            ),
            monthlyPaymentHistory:
              g.monthTotals
                ?.map((mt) => {
                  if (!mt.month) {
                    return null
                  }
                  return {
                    monthIndex: mt.month,
                    amount: mt.amount ?? undefined,
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
                    type: r.name,
                    totalYearCumulativeAmount: r.months?.reduce(
                      (total, current) => (total += current.amount ?? 0),
                      0,
                    ),
                    monthlyPaymentHistory:
                      r.months
                        ?.map((m) => {
                          if (!m.month) {
                            return null
                          }
                          return {
                            monthIndex: m.month,
                            amount: m.amount ?? undefined,
                          }
                        })
                        .filter(isDefined) ?? [],
                  }
                })
                .filter(isDefined) ?? [],
          }
        })
        .filter(isDefined) ?? []

    const data = {
      nextPayment: payments?.nextPayment ?? undefined,
      previousPayment: payments?.previousPayment ?? undefined,
      paymentGroups: paymentGroups,
    }

    //if no data
    if (!data.nextPayment && !data.previousPayment && !paymentGroups.length) {
      return undefined
    }

    return data
  }
}
