import {
  addXroadMock,
  resetMocks,
  wildcard,
} from '../../../../support/wire-mocks'
import { Response } from '@anev/ts-mountebank'
import { Properties, Base } from '../../../../../../../infra/src/dsl/xroad'
import { env } from '../../../../support/urls'
import { getEnvVariables } from '../../../../../../../infra/src/dsl/service-to-environment/pre-process-service'
import { EnvironmentConfig } from '../../../../../../../infra/src/dsl/types/charts'

export async function setupXroadMocks() {
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
