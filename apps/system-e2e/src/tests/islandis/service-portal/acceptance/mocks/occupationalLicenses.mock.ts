import { addXroadMock } from '../../../../../support/wire-mocks'
import { Response } from '@anev/ts-mountebank'
import {
  Education,
  OccupationalLicenses,
} from '../../../../../../../../infra/src/dsl/xroad'

export const loadOccupationalLicensesXroadMocks = async () => {
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Education,
    prefix: 'XROAD_MMS_LICENSE_SERVICE_ID',
    apiPath: '/api/public/users/0101302209/licenses',
    response: [
      new Response().withJSONBody([
        {
          id: '123',
          issued: '2022-06-25T00:00:00.000Z',
          nationalId: '0101302209',
          type: 'kennari',
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
}
