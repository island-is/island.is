import {
  addXroadMock,
  resetMocks,
  wildcard,
} from '../../../../support/wire-mocks'
import { HttpMethod, Response } from '@anev/ts-mountebank'
import {
  Properties,
  Base,
  HealthInsurance,
} from '../../../../../../../infra/src/dsl/xroad'
import { env } from '../../../../support/urls'
import { getEnvVariables } from '../../../../../../../infra/src/dsl/service-to-environment/pre-process-service'
import { EnvironmentConfig } from '../../../../../../../infra/src/dsl/types/charts'

export const setupXroadMocks = async () => {
  await resetMocks()
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Properties,
    prefix: 'XROAD_PROPERTIES_SERVICE_V2_PATH',
    apiPath: '/api/v1/fasteignir',
    response: [
      new Response().withJSONBody({
        paging: {
          page: 1,
          pageSize: 10,
          total: 10,
          totalPages: 1,
          offset: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        },
        fasteignir: [
          {
            fasteignanumer: 'F12345',
            sjalfgefidStadfang: {
              birtingStutt: 'Eldfjallagata 23',
              birting: 'Eldfjallagata 23, Siglufjörður',
              landeignarnumer: '123',
              sveitarfelagBirting: 'Siglufjörður',
              postnumer: '580',
              stadfanganumer: '88',
            },
          },
        ],
      }),
    ],
  })

  await addXroadMock({
    prefixType: 'only-base-path',
    config: Properties,
    prefix: 'XROAD_PROPERTIES_SERVICE_V2_PATH',
    apiPath: '/api/v1/fasteignir/12345',
    response: [
      new Response().withJSONBody({
        fasteignanumer: 'F12345',
        sjalfgefidStadfang: {
          stadfanganumer: 1234,
          landeignarnumer: 567,
          postnumer: 113,
          sveitarfelagBirting: 'Reykjavík',
          birting: 'Reykjavík',
          birtingStutt: 'RVK',
        },
        fasteignamat: {
          gildandiFasteignamat: 50000000,
          fyrirhugadFasteignamat: 55000000,
          gildandiMannvirkjamat: 30000000,
          fyrirhugadMannvirkjamat: 35000000,
          gildandiLodarhlutamat: 20000000,
          fyrirhugadLodarhlutamat: 25000000,
          gildandiAr: 2024,
          fyrirhugadAr: 2025,
        },
        landeign: {
          landeignarnumer: '123456',
          lodamat: 75000000,
          notkunBirting: 'Íbúðarhúsalóð',
          flatarmal: '300000',
          flatarmalEining: 'm²',
        },
        thinglystirEigendur: {
          thinglystirEigendur: [
            {
              nafn: 'Jón Jónsson',
              kennitala: '2222222222',
              eignarhlutfall: 0.5,
              kaupdagur: new Date(),
              heimildBirting: 'A+',
            },
            {
              nafn: 'Jóna Jónasdóttir',
              kennitala: '3333333333',
              eignarhlutfall: 0.5,
              kaupdagur: new Date(),
              heimildBirting: 'A+',
            },
          ],
        },
        notkunareiningar: undefined,
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

  const { envs } = getEnvVariables(Base.getEnv(), 'system-e2e', env)
  const xroadBasePath = envs['XROAD_BASE_PATH']
  const path =
    typeof xroadBasePath === 'string'
      ? xroadBasePath
      : xroadBasePath({
          svc: (args) => {
            return args as string
          },
          env: {} as EnvironmentConfig,
        })
  await wildcard(path)
}
