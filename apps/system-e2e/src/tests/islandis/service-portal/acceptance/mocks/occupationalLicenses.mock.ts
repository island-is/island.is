import { addXroadMock } from '../../../../../support/wire-mocks'
import { Response } from '@anev/ts-mountebank'
import {
  DistrictCommissionersPCard,
  Education,
  OccupationalLicenses,
} from '../../../../../../../../infra/src/dsl/xroad'

export const loadOccupationalLicensesXroadMocks = async () => {
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Education,
    prefix: 'XROAD_MMS_LICENSE_SERVICE_ID',
    apiPath: '/api/public/users/0101302399/licenses',
    response: [
      new Response().withJSONBody([
        {
          id: '123',
          issued: '2999-01-01T00:00:00.000Z',
          nationalId: '123',
          type: 'kennari TEST',
          fullName: 'Testi gæ',
          s3Key: null,
          contentHash: null,
          issuer: 'Online skóli',
          country: 'Iceland',
          created: '2023-01-19T12:16:07.157Z',
          modified: '2023-01-19T12:16:07.157Z',
        },
      ]),
    ],
  })

  await addXroadMock({
    prefixType: 'only-base-path',
    config: OccupationalLicenses,
    prefix: 'XROAD_HEALTH_DIRECTORATE_PATH',
    apiPath: '/StarfsleyfiAMinumSidum',
    response: [
      new Response().withJSONBody([
        {
          logadili_ID: '019',
          kennitala: '1234',
          nafn: 'Buggi',
          starfsstett: 'Bebeb',
          leyfi: 'Starfsleyfi',
          leyfisnumer: '13',
          gildir_Fra: new Date('1978-09-13T00:00:00'),
          gildir_TIl: new Date('2030-09-13T00:00:00'),
          id: '1337',
          stada: 'góð bara, takk',
        },
      ]),
    ],
  })

  await addXroadMock({
    prefixType: 'only-base-path',
    config: DistrictCommissionersPCard,
    prefix: 'XROAD_DISTRICT_COMMISSIONERS_P_CARD_PATH',
    apiPath: '/RettindiFyrirIslandIs/RettindiFyrirIslandIs',
    response: [
      new Response().withJSONBody({
        leyfi: [
          {
            audkenni: '1010101',
            titill: 'Heimagisting - Test',
            utgafudagur: '2022-07-11T14:40:36',
            utgefandi: {
              audkenni: '41',
              titill: 'Sýslumaðurinn á höfuðborgarsvæðinu',
            },
            stada: {
              titill: 'Útrunnið',
              kodi: 'EXPIRED',
            },
          },

          {
            audkenni: '123',
            titill: 'Verðbréfaréttindi',
            utgafudagur: '2023-03-29T22:54:26',
            utgefandi: {
              audkenni: '41',
              titill: 'Sýslumaðurinn á höfuðborgarsvæðinu',
            },
            stada: {
              titill: 'Í gildi',
              kodi: 'VALID',
            },
          },
          {
            audkenni: '789',
            titill: 'Heimagisting - Test2',
            utgafudagur: null,
            utgefandi: {
              audkenni: '41',
              titill: 'Sýslumaðurinn á höfuðborgarsvæðinu',
            },
            stada: {
              titill: 'Í vinnslu',
              kodi: 'INPROGRESS',
            },
          },
        ],
        villur: {
          kodi: null,
          skilabod: null,
        },
      }),
    ],
  })

  await addXroadMock({
    prefixType: 'only-base-path',
    config: DistrictCommissionersPCard,
    prefix: 'XROAD_DISTRICT_COMMISSIONERS_P_CARD_PATH',
    apiPath: '/RettindiFyrirIslandIs/RettindiFyrirIslandIs/123',
    response: [
      new Response().withJSONBody({
        nafn: 'Bubbi verðbréfakall',
        leyfi: {
          audkenni: '123',
          titill: 'Verðbréfaréttindi',
          utgafudagur: '1999-12-12T01:01:01',
          utgefandi: {
            audkenni: '999',
            titill: 'Sýslukall',
          },
          stada: {
            titill: 'Í vinnslu',
            kodi: 'INPROGRESS',
          },
        },
        svid: [
          {
            heiti: 'Gildir til',
            gildi: '1.1.2999',
            tegund: 'date',
          },
        ],
        textar: {
          haus: 'Verðbréfaréttindi abc',
          fotur: 'blablabla',
        },
        adgerdir: [
          {
            tegund: 'postholf',
            titill: 'test pósthólf',
            slod: '123xyz',
          },
          {
            tegund: 'link',
            titill: 'Test link',
            slod: 'https://example.org',
          },
        ],
        skrar: null,
        villur: null,
      }),
    ],
  })
}
