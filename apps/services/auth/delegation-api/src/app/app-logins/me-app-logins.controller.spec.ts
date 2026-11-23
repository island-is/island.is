import { getModelToken } from '@nestjs/sequelize'
import request, { SuperTest, Test } from 'supertest'

import { ApiScope } from '@island.is/auth/scopes'
import {
  DeviceRegistration,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { User } from '@island.is/auth-nest-tools'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { TestApp, setupApp } from '@island.is/testing/nest'

import { FeatureFlagServiceMock } from '../../../test/mocks/featureFlagService.mock'
import { AppModule } from '../app.module'

const currentUser = createCurrentUser({ scope: [ApiScope.internal] })

const registration = (
  nationalId: string,
  overrides: Partial<DeviceRegistration> = {},
) => {
  const thumbprint = `thumbprint-${Math.random()}`
  return {
    nationalId,
    userSub: `sub-${nationalId}`,
    clientId: '@island.is/app',
    installKeyJwk: '{"kty":"EC"}',
    installKeyThumbprint: thumbprint,
    biometricKeyJwk: null,
    biometricKeyThumbprint: null,
    platform: 'ios',
    deviceName: 'iPhone',
    loginIdp: 'audkenni_sim',
    audkenniSimNumber: '7654321',
    developmentBuild: false,
    lastUsed: new Date('2026-11-20T10:00:00Z'),
    ...overrides,
  }
}

const setup = (user: User, featureFlag: unknown = FeatureFlagServiceMock) =>
  setupApp({
    AppModule,
    SequelizeConfigService,
    user,
    dbType: 'postgres',
    override: (builder) =>
      builder.overrideProvider(FeatureFlagService).useValue(featureFlag),
  })

describe('MeAppLoginsController', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let registrationModel: typeof DeviceRegistration

  beforeAll(async () => {
    app = await setup(currentUser)
    server = request(app.getHttpServer())
    registrationModel = app.get(getModelToken(DeviceRegistration))
    await new FixtureFactory(app).createClient({
      clientId: '@island.is/app',
      clientName: 'Ísland.is appið',
    })
  })

  beforeEach(async () => {
    await registrationModel.destroy({ truncate: true })
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe('GET /v1/me/app-logins', () => {
    it('returns the person’s app logins without key material or SIM number', async () => {
      const own = await registrationModel.create(
        registration(currentUser.nationalId, {
          biometricKeyJwk: '{"kty":"EC"}',
          biometricKeyThumbprint: 'biometric',
        }),
      )
      await registrationModel.create(registration(createNationalId('person')))

      const res = await server.get('/v1/me/app-logins')

      expect(res.status).toBe(200)
      expect(res.body).toEqual([
        {
          id: own.id,
          clientId: '@island.is/app',
          clientName: 'Ísland.is appið',
          platform: 'ios',
          deviceName: 'iPhone',
          loginIdp: 'audkenni_sim',
          biometrics: true,
          created: own.created.toISOString(),
          lastUsed: '2026-11-20T10:00:00.000Z',
        },
      ])
    })

    it('returns an empty list when the person has no app login', async () => {
      const res = await server.get('/v1/me/app-logins')

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })
  })

  describe('DELETE /v1/me/app-logins/:id', () => {
    it('removes the person’s app login', async () => {
      const own = await registrationModel.create(
        registration(currentUser.nationalId),
      )

      const res = await server.delete(`/v1/me/app-logins/${own.id}`)

      expect(res.status).toBe(204)
      expect(await registrationModel.findByPk(own.id)).toBeNull()
    })

    it('returns 404 for someone else’s app login and leaves it', async () => {
      const other = await registrationModel.create(
        registration(createNationalId('person')),
      )

      const res = await server.delete(`/v1/me/app-logins/${other.id}`)

      expect(res.status).toBe(404)
      expect(await registrationModel.findByPk(other.id)).not.toBeNull()
    })

    it('returns 400 for an id that is not a uuid', async () => {
      const res = await server.delete('/v1/me/app-logins/not-a-uuid')

      expect(res.status).toBe(400)
    })
  })
})

describe('MeAppLoginsController access', () => {
  it.each`
    case                    | user                                                                                                    | featureFlag
    ${'without the scope'}  | ${createCurrentUser()}                                                                                  | ${FeatureFlagServiceMock}
    ${'acting for someone'} | ${createCurrentUser({ scope: [ApiScope.internal], actor: { nationalId: createNationalId('person') } })} | ${FeatureFlagServiceMock}
    ${'with the flag off'}  | ${currentUser}                                                                                          | ${{ getValue: () => Promise.resolve(false) }}
  `('returns 403 $case', async ({ user, featureFlag }) => {
    const app = await setup(user, featureFlag)
    const server = request(app.getHttpServer())
    const registrationModel: typeof DeviceRegistration = app.get(
      getModelToken(DeviceRegistration),
    )
    const own = await registrationModel.create(registration(user.nationalId))

    const list = await server.get('/v1/me/app-logins')
    const remove = await server.delete(`/v1/me/app-logins/${own.id}`)

    expect(list.status).toBe(403)
    expect(remove.status).toBe(403)
    expect(await registrationModel.findByPk(own.id)).not.toBeNull()

    await registrationModel.destroy({ truncate: true })
    await app.cleanUp()
  })
})
