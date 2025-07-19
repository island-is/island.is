import { addXroadMock } from '@island.is/testing/e2e'
import { Response } from '@anev/ts-mountebank'
import { Properties } from '../../../../../../infra/src/dsl/xroad'

export const loadAssetsXroadMocks = async () => {
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
}
