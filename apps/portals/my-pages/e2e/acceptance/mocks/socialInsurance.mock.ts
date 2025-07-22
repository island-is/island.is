import { addXroadMock } from '@island.is/testing/e2e'
import { Response } from '@anev/ts-mountebank'
import { SocialInsuranceAdministration } from '../../../../../../infra/src/dsl/xroad'

export const loadSocialInsuranceXroadMocks = async () => {
  await addXroadMock({
    prefixType: 'only-base-path',
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: '/api/protected/v1/PaymentPlan',
    response: [
      new Response().withJSONBody({
        totalPayment: 61461,
        subtracted: -15,
        paidOut: 1234,
        groups: [
          {
            group: 'Skattskyldar greiðslutegundir',
            groupId: 10,
            total: 84,
            monthTotals: [
              {
                month: 0,
                amount: 95630,
              },
            ],
            rows: [
              {
                name: 'Ellilífeyrir',
                total: 96743826,
                months: [
                  {
                    month: 0,
                    amount: 2346,
                  },
                ],
              },
              {
                name: 'Orlofs- og desemberuppbót á ellilífeyri',
                total: 1235464,
                months: [
                  {
                    month: 0,
                    amount: 15,
                  },
                ],
              },
            ],
          },
          {
            group: 'Frádráttur',
            groupId: 20,
            total: -1350545,
            monthTotals: [
              {
                month: 0,
                amount: -11115,
              },
            ],
            rows: [
              {
                name: 'Staðgreiðsla',
                total: -1555,
                months: [
                  {
                    month: 0,
                    amount: -9875,
                  },
                ],
              },
            ],
          },
          {
            group: 'Ráðstöfun',
            groupId: 30,
            total: 775,
            monthTotals: [
              {
                month: 0,
                amount: 25252,
              },
            ],
            rows: [
              {
                name: 'Til greiðslu',
                total: 333555,
                months: [
                  {
                    month: 0,
                    amount: 999888,
                  },
                ],
              },
            ],
          },
        ],
      }),
    ],
  })

  await addXroadMock({
    prefixType: 'only-base-path',
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: '/api/protected/v1/PaymentPlan/legitimatepayments',
    response: [
      new Response().withJSONBody({
        nextPayment: 1587,
        previousPayment: 98671498,
      }),
    ],
  })
}
