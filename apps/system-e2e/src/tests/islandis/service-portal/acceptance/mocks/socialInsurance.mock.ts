import { addXroadMock } from '../../../../../support/wire-mocks'
import { Response } from '@anev/ts-mountebank'
import { SocialInsuranceAdministration } from '../../../../../../../../infra/src/dsl/xroad'

export const loadSocialInsuranceXroadMocks = async () => {
  await addXroadMock({
    prefixType: 'only-base-path',
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: '/api/protected/v1/PaymentPlan?year=2023',
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
                name: '2023 - Ellilífeyrir',
                total: 96743826,
                months: [
                  {
                    month: 0,
                    amount: 2346,
                  },
                ],
              },
              {
                name: '2023 - Orlofs- og desemberuppbót á ellilífeyri',
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
    apiPath: '/api/protected/v1/PaymentPlan?year=2024',
    response: [
      new Response().withJSONBody({
        totalPayment: 1017,
        subtracted: -567,
        paidOut: -5,
        groups: [
          {
            group: 'Skattskyldar greiðslutegundir nema arið 2024',
            groupId: 10,
            total: 1017,
            monthTotals: [
              {
                month: 0,
                amount: 1,
              },
              {
                month: 2,
                amount: 10,
              },
              {
                month: 4,
                amount: 101,
              },
              {
                month: 6,
                amount: 905,
              },
            ],
            rows: [
              {
                name: '2024 - Ellilífeyrir',
                total: 9,
                months: [
                  {
                    month: 0,
                    amount: 9,
                  },
                ],
              },
              {
                name: '2024 - total test',
                total: 1,
                months: [
                  {
                    month: 0,
                    amount: 1,
                  },
                ],
              },
            ],
          },
          {
            group: 'Frádráttur',
            groupId: 20,
            total: -567,
            monthTotals: [
              {
                month: 0,
                amount: -567,
              },
            ],
            rows: [
              {
                name: 'Staðgreiðsla',
                group: 'Frádráttur',
                groupId: 20,
                type: 'LXX',
                overviewType: 'A',
                period: null,
                expenseItem: null,
                from: null,
                order: 'branaerwa',
                subType: null,
                settlementYear: null,
                months: [
                  {
                    month: 0,
                    amount: -567,
                  },
                ],
              },
            ],
          },
          {
            group: 'Ráðstöfun',
            groupId: 30,
            total: -5,
            monthTotals: [
              {
                month: 0,
                amount: -5,
              },
            ],
            rows: [
              {
                name: 'Til greiðslu',
                total: -5,
                months: [
                  {
                    month: 0,
                    amount: -5,
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

  await addXroadMock({
    prefixType: 'only-base-path',
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: '/api/protected/v1/PaymentPlan/validyears',
    response: [new Response().withJSONBody([2024, 2023])],
  })
}
