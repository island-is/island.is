import { setup } from '../../../../../../test/setup'
import {
  emptyResponseExpectedStructure,
  errorExpectedStructure,
} from '../../../../../../test/testHelpers'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { TemporaryVoterRegistry } from '@island.is/auth/scopes'

interface SetupAuthInput {
  nationalId: string
  scope?: TemporaryVoterRegistry[]
}
const getAuthenticatedApp = ({
  nationalId,
  scope = [TemporaryVoterRegistry.read],
}: SetupAuthInput): Promise<INestApplication> =>
  setup({
    override: (builder) => {
      builder
        .overrideProvider(IdsUserGuard)
        .useValue(
          new MockAuthGuard({
            nationalId,
            scope,
          }),
        )
        .compile()
    },
  })

describe('findByAuthVoterRegistry', () => {
  it('GET /voter-registry should return error when auth does not have the requested scope', async () => {
    const nationalId = '0101302989'
    const app = await getAuthenticatedApp({ nationalId, scope: [] })
    const response = await request(app.getHttpServer())
      .get('/voter-registry')
      .send()
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it('GET /voter-registry should return not registered response when trying to fetch older version', async () => {
    const nationalId = '0101303019'
    const app = await getAuthenticatedApp({ nationalId })
    const response = await request(app.getHttpServer())
      .get('/voter-registry')
      .send()
      .expect(200)

    expect(response.body).toMatchObject({
      ...emptyResponseExpectedStructure,
      nationalId,
    })
  })
  it('GET /voter-registry should return entry from current version', async () => {
    const nationalId = '0101302989'
    const app = await getAuthenticatedApp({ nationalId })
    const response = await request(app.getHttpServer())
      .get('/voter-registry')
      .send()
      .expect(200)

    expect(response.body).toMatchObject({
      nationalId,
      version: 3,
    })
  })
})
