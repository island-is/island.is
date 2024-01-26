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
    const data = {
      nextPayment: 186954,
      previousPayment: 12000,
      paymentGroups: [
        {
          type: 'Greiðslugreiðar',
          totalYearCumulativeAmount: 18990,
          payments: [
            {
              type: 'Greiður',
              totalYearCumulativeAmount: 1111,
              monthlyPaymentHistory: [
                {
                  monthIndex: 3,
                  amount: 1000,
                },
                {
                  monthIndex: 8,
                  amount: 111,
                },
              ],
            },
            {
              type: 'Tryggingar',
              totalYearCumulativeAmount: 199999,
              monthlyPaymentHistory: [
                {
                  monthIndex: 10,
                  amount: 1000,
                },
                {
                  monthIndex: 2,
                  amount: 111,
                },
                {
                  monthIndex: 4,
                  amount: 198988,
                },
              ],
            },
            {
              type: 'eitthvað',
              totalYearCumulativeAmount: 500000,
              monthlyPaymentHistory: [
                {
                  monthIndex: 2,
                  amount: 250,
                },
                {
                  monthIndex: 3,
                  amount: 250,
                },
                {
                  monthIndex: 7,
                  amount: 250000,
                },
                {
                  monthIndex: 11,
                  amount: 249500,
                },
              ],
            },
          ],
          monthlyPaymentHistory: [
            {
              monthIndex: 2,
              amount: 18990,
            },
          ],
        },
        {
          type: 'Frádráttur',
          totalYearCumulativeAmount: 400000,
          payments: [
            {
              type: 'Borga borga',
              totalYearCumulativeAmount: 40000,
              monthlyPaymentHistory: [
                {
                  monthIndex: 2,
                  amount: 40000,
                },
                {
                  monthIndex: 12,
                  amount: 360001,
                },
              ],
            },
          ],
          monthlyPaymentHistory: [
            {
              monthIndex: 2,
              amount: 5,
            },
          ],
        },
        {
          type: 'Flokkur 2',
          totalYearCumulativeAmount: 999999,
          payments: [
            {
              type: 'Bingó',
              totalYearCumulativeAmount: 1111,
              monthlyPaymentHistory: [
                {
                  monthIndex: 3,
                  amount: 1000,
                },
                {
                  monthIndex: 8,
                  amount: 111,
                },
              ],
            },
            {
              type: 'Bangó',
              totalYearCumulativeAmount: 199999,
              monthlyPaymentHistory: [
                {
                  monthIndex: 10,
                  amount: 1000,
                },
                {
                  monthIndex: 2,
                  amount: 111,
                },
                {
                  monthIndex: 4,
                  amount: 198988,
                },
              ],
            },
          ],
          monthlyPaymentHistory: [
            {
              monthIndex: 1,
              amount: 5000,
            },
            {
              monthIndex: 2,
              amount: 12345,
            },
            {
              monthIndex: 3,
              amount: 56789,
            },
            {
              monthIndex: 4,
              amount: 13689,
            },
            {
              monthIndex: 5,
              amount: 572,
            },
            {
              monthIndex: 6,
              amount: 1,
            },
            {
              monthIndex: 7,
              amount: 8079,
            },
            {
              monthIndex: 8,
              amount: 1863,
            },
            {
              monthIndex: 9,
              amount: 32,
            },
            {
              monthIndex: 10,
              amount: 7654,
            },
            {
              monthIndex: 11,
              amount: 13261,
            },
            {
              monthIndex: 12,
              amount: 9743,
            },
          ],
        },
      ],
    }

    return data
  }
}
