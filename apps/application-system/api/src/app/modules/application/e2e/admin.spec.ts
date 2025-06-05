import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { AdminPortalScope, ApplicationScope } from '@island.is/auth/scopes'
import { setup } from '../../../../../test/setup'
import { AppModule } from '../../../app.module'
import request from 'supertest'
import { ApplicationTypes } from '@island.is/application/types'
import { INestApplication } from '@nestjs/common'

let app: INestApplication
let server: request.SuperTest<request.Test>

const nationalIdUserWithoutAdminScope = '1234564321'
const mockAuthGaurdUserWithoutAdminScope = new MockAuthGuard({
  nationalId: nationalIdUserWithoutAdminScope,
  scope: [ApplicationScope.read, ApplicationScope.write],
})

const nationalIdUserWithAdminScope = '1234564321'
const mockAuthGaurdUserWithAdminScope = new MockAuthGuard({
  nationalId: nationalIdUserWithAdminScope,
  scope: [
    ApplicationScope.read,
    ApplicationScope.write,
    AdminPortalScope.applicationSystemAdmin,
  ],
})

describe('testing get all for user without admin scope', () => {
  // Applies only to tests in this describe block
  beforeAll(async () => {
    app = await setup(AppModule, {
      override: (builder) =>
        builder
          .overrideGuard(IdsUserGuard)
          .useValue(mockAuthGaurdUserWithoutAdminScope),
    })

    server = request(app.getHttpServer())
  })

  it('GET /admin/:nationalId/applications should return unauthorized for a user without the admin scope', async () => {
    const getResponse = await server
      .get(`/admin/${nationalIdUserWithoutAdminScope}/applications`)
      .expect(403)

    // Assert
    expect(getResponse.body.title).toBe('Forbidden')
  })
})

describe('testing get all for user with admin scope', () => {
  // Applies only to tests in this describe block
  beforeAll(async () => {
    app = await setup(AppModule, {
      override: (builder) =>
        builder
          .overrideGuard(IdsUserGuard)
          .useValue(mockAuthGaurdUserWithAdminScope),
    })

    server = request(app.getHttpServer())
  })

  it.skip('GET /admin/:nationalId/applications should return all applications for the requested nationalid, stripping away answers and externalData', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    // Advance from prerequisites state
    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const getResponse = await server
      .get(`/admin/${nationalIdUserWithAdminScope}/applications`)
      .expect(200)

    // Assert that answers and externalData are stripped away
    expect(getResponse.body).toHaveLength(1)
    expect(getResponse.body[0].answers).toStrictEqual([])
    expect(getResponse.body[0].externalData).toStrictEqual([])

    expect(getResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ applicant: nationalIdUserWithAdminScope }),
      ]),
    )
  })
})
