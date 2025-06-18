import { addXroadMock } from '../../../../../support/wire-mocks'
import { HttpMethod, Response } from '@anev/ts-mountebank'
import { HealthInsurance } from '../../../../../../../../infra/src/dsl/xroad'

export const loadHealthInsuranceXroadMocks = async () => {
  await addXroadMock({
    prefixType: 'only-base-path',
    config: HealthInsurance,
    prefix: 'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
    apiPath: '/v1/overview/insurance',
    response: [
      new Response().withJSONBody({
        isInsured: true,
        explanation: 'Testing',
        from: new Date(),
        status: {
          display: 'test status',
          code: 'ALM',
        },
        maximumPayment: 80,
        refundDate: new Date('2030-05-18T00:00:00.000Z'),
        ehicCardExpiryDate: new Date('2030-05-18T00:00:00.000Z'),
      }),
    ],
  })

  await addXroadMock({
    prefixType: 'only-base-path',
    config: HealthInsurance,
    prefix: 'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
    apiPath: '/v1/dentists/current',
    response: [
      new Response().withJSONBody({
        id: 123,
        name: 'Ósvikinn læknir',
      }),
    ],
  })

  await addXroadMock({
    prefixType: 'only-base-path',
    config: HealthInsurance,
    prefix: 'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
    apiPath: '/v1/dentists/status',
    response: [
      new Response().withJSONBody({
        isInsured: true,
        canRegister: true,
        contractType: '0',
      }),
    ],
  })

  await addXroadMock({
    prefixType: 'only-base-path',
    config: HealthInsurance,
    prefix: 'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
    method: HttpMethod.POST,
    apiPath: '/v1/dentists/1010101/register',
    response: new Response().withStatusCode(200).withBody(null),
  })
  await addXroadMock({
    prefixType: 'only-base-path',
    config: HealthInsurance,
    prefix: 'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
    apiPath: '/v1/dentists/bills',
    response: [
      new Response().withJSONBody([
        {
          number: 123,
          amount: 456,
          coveredAmount: 789,
          date: new Date('2023-11-29T00:00:00.000Z'),
          refundDate: new Date('2023-11-29T00:00:00.000Z'),
        },
        {
          number: 10000,
          amount: 7979,
          coveredAmount: 6868,
          date: new Date('2023-04-18T00:00:00.000Z'),
          refundDate: new Date('2023-05-18T00:00:00.000Z'),
        },
      ]),
    ],
  })
  await addXroadMock({
    prefixType: 'only-base-path',
    config: HealthInsurance,
    prefix: 'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
    apiPath: '/v1/dentists',
    response: [
      new Response().withJSONBody({
        dentists: [
          {
            id: 123,
            name: 'Ósvikinn læknir',
            practices: [
              {
                practice: 'Alvöru heilsgæsla ehf',
                address: 'Ekki feikgata 18',
                region: 'Langtíburtistan',
                postalCode: '999',
              },
            ],
          },
          {
            id: 1010101,
            name: 'Skottulæknir',
            practices: [
              {
                practice: 'Inn í hól 2',
                address: 'Uppáhæð',
                region: 'Kópasker',
                postalCode: '670',
              },
            ],
          },
        ],
        pageInfo: {
          hasPreviousPage: false,
          hasNextPage: false,
        },
        totalCount: 2,
      }),
    ],
  })
  await addXroadMock({
    prefixType: 'only-base-path',
    config: HealthInsurance,
    prefix: 'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
    apiPath: '/v1/healthcenters',
    response: [
      new Response().withJSONBody({
        healthCenters: [
          {
            id: 123,
            url: 'www.alvoru-docs.au',
            name: 'Ekki gildra ehf',
            address: 'Annar álfasteinn til vinstri',
            city: 'Rauðhólar 25',
            region: 'Álfaskeið',
            waitlistRegistration: false,
            dateFrom: new Date('2023-11-29T00:00:00.000Z'),
            postalCode: '999',
          },
          {
            id: 987,
            url: 'doc-ock.oc',
            name: 'Octavius enterprises',
            address: 'High street',
            city: 'New yahk citeh',
            region: 'Hrunamannahreppur',
            waitlistRegistration: false,
            dateFrom: new Date('2023-11-29T00:00:00.000Z'),
            postalCode: '129',
          },
        ],
        pageInfo: {
          hasPreviousPage: false,
          hasNextPage: false,
        },
        totalCount: 2,
      }),
    ],
  })
  await addXroadMock({
    prefixType: 'only-base-path',
    config: HealthInsurance,
    prefix: 'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
    apiPath: '/v1/healthcenters/history',
    response: [
      new Response().withJSONBody([
        {
          dateFrom: new Date('2023-11-29T00:00:00.000Z'),
          dateTo: new Date('2023-11-30T00:00:00.000Z'),
          registrationType: 'kvef',
          registrationTypeCode: 1,
          healthCenter: {
            healthCenter: 'Ekki gildra ehf',
            url: 'www.alvoru-docs.au',
            doctor: 'Hr. Doktor',
          },
        },
        {
          dateFrom: new Date('2023-11-05T00:00:00.000Z'),
          dateTo: new Date('2023-11-05T00:00:00.000Z'),
          registrationType: 'svo kvefaður omg',
          registrationTypeCode: 2,
          healthCenter: {
            healthCenter: 'Ekki gildra ehf',
            url: 'www.alvoru-docs.au',
            doctor: 'Doktor læknir md.',
          },
        },
      ]),
    ],
  })
  await addXroadMock({
    prefixType: 'only-base-path',
    config: HealthInsurance,
    prefix: 'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
    apiPath: '/v1/healthcenters/current',
    response: [
      new Response().withJSONBody({
        healthCenter: 'Dýraspítalinn Víðidal',
        url: 'heal-ur-pets.org',
        doctor: 'Sámur Læknir, md., góður strákur',
        canRegister: true,
      }),
    ],
  })
  await addXroadMock({
    prefixType: 'only-base-path',
    config: HealthInsurance,
    prefix: 'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
    method: HttpMethod.POST,
    apiPath: '/v1/healthcenters/123/register',
    response: new Response().withStatusCode(200).withBody(null),
  })
  await addXroadMock({
    prefixType: 'only-base-path',
    config: HealthInsurance,
    prefix: 'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
    method: HttpMethod.POST,
    apiPath: '/v1/healthcenters/987/register',
    response: new Response().withStatusCode(200).withBody(null),
  })
}
