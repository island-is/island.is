import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'

import {
  DeviceRegistration,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  getRequestMethod,
  setupApp,
  setupAppWithoutAuth,
  TestApp,
  TestEndpointOptions,
} from '@island.is/testing/nest'

import { defaultScopes, setupWithAuth } from '../../../test/setup'
import { AppModule } from '../app.module'

const clientId = '@island.is/app'
const path = '/v1/device-registrations'

const registration = (overrides: Record<string, unknown> = {}) => ({
  nationalId: '0101302989',
  userSub: 'subject-1',
  clientId,
  installKeyJwk: '{"kty":"EC","crv":"P-256","x":"x1","y":"y1"}',
  installKeyThumbprint: 'install-1',
  platform: 'apple',
  loginIdp: 'audkenni_sim',
  lastUsed: new Date('2026-11-05T12:00:00Z').toISOString(),
  ...overrides,
})

describe('DeviceRegistrationsController', () => {
  describe('with auth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let model: typeof DeviceRegistration

    beforeAll(async () => {
      const user = createCurrentUser({
        scope: [defaultScopes.testUserHasAccess.name],
      })
      app = await setupWithAuth({ user })
      server = request(app.getHttpServer())
      model = app.get(getModelToken(DeviceRegistration))
    })

    beforeEach(async () => {
      await model.destroy({ where: {}, truncate: true, force: true })
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('creates a registration and finds it by install key', async () => {
      // Act
      const saved = await server.put(path).send(registration())
      const found = await server
        .get(`${path}/install-keys/install-1`)
        .query({ clientId })

      // Assert
      expect(saved.status).toBe(200)
      expect(saved.body.id).toEqual(expect.any(String))
      expect(found.status).toBe(200)
      expect(found.body).toMatchObject({
        id: saved.body.id,
        nationalId: '0101302989',
        installKeyThumbprint: 'install-1',
        biometricKeyJwk: null,
        loginIdp: 'audkenni_sim',
      })
    })

    it('returns 404 for an install with no registration', async () => {
      // Act
      const response = await server
        .get(`${path}/install-keys/unknown`)
        .query({ clientId })

      // Assert
      expect(response.status).toBe(404)
    })

    it('keeps one app login per person: a new install replaces the old one', async () => {
      // Arrange
      const first = await server.put(path).send(registration())

      // Act
      const second = await server
        .put(path)
        .send(registration({ installKeyThumbprint: 'install-2' }))

      // Assert
      expect(second.body.id).toBe(first.body.id)
      expect(await model.count()).toBe(1)
      expect(
        (await server.get(`${path}/install-keys/install-1`).query({ clientId }))
          .status,
      ).toBe(404)
    })

    it('updates the biometric key and last used', async () => {
      // Arrange
      await server.put(path).send(registration())

      // Act
      const response = await server.put(path).send(
        registration({
          biometricKeyJwk: '{"kty":"EC","crv":"P-256","x":"x2","y":"y2"}',
          biometricKeyThumbprint: 'biometric-1',
          lastUsed: new Date('2026-11-06T12:00:00Z').toISOString(),
        }),
      )

      // Assert
      expect(response.body).toMatchObject({
        biometricKeyThumbprint: 'biometric-1',
        lastUsed: '2026-11-06T12:00:00.000Z',
      })
    })

    it('moves an install key logged in by another person to them', async () => {
      // Arrange
      await server.put(path).send(registration())

      // Act
      await server
        .put(path)
        .send(registration({ nationalId: '0101303019', userSub: 'subject-2' }))

      // Assert
      const found = await server
        .get(`${path}/install-keys/install-1`)
        .query({ clientId })
      expect(found.body.nationalId).toBe('0101303019')
      expect(await model.count()).toBe(1)
    })

    it('patches the biometric key while the install key still matches', async () => {
      // Arrange
      const saved = await server.put(path).send(registration())

      // Act
      const response = await server.patch(`${path}/${saved.body.id}`).send({
        installKeyThumbprint: 'install-1',
        biometricKeyJwk: '{"kty":"EC","crv":"P-256","x":"x2","y":"y2"}',
        biometricKeyThumbprint: 'biometric-1',
        lastUsed: new Date('2026-11-06T12:00:00Z').toISOString(),
      })

      // Assert
      expect(response.status).toBe(204)
      const found = await server
        .get(`${path}/install-keys/install-1`)
        .query({ clientId })
      expect(found.body.biometricKeyThumbprint).toBe('biometric-1')
    })

    it('refuses a stale patch from an install that was replaced', async () => {
      // Arrange
      const saved = await server.put(path).send(registration())
      await server
        .put(path)
        .send(registration({ installKeyThumbprint: 'install-2' }))

      // Act
      const response = await server.patch(`${path}/${saved.body.id}`).send({
        installKeyThumbprint: 'install-1',
        lastUsed: new Date().toISOString(),
      })

      // Assert
      expect(response.status).toBe(404)
      const found = await server
        .get(`${path}/install-keys/install-2`)
        .query({ clientId })
      expect(found.status).toBe(200)
    })

    it('leaves the biometric key alone on a patch without it', async () => {
      // Arrange
      const saved = await server.put(path).send(
        registration({
          biometricKeyJwk: '{"kty":"EC","crv":"P-256","x":"x2","y":"y2"}',
          biometricKeyThumbprint: 'biometric-1',
        }),
      )

      // Act
      await server.patch(`${path}/${saved.body.id}`).send({
        installKeyThumbprint: 'install-1',
        lastUsed: new Date('2026-11-07T12:00:00Z').toISOString(),
      })

      // Assert
      const found = await server
        .get(`${path}/install-keys/install-1`)
        .query({ clientId })
      expect(found.body).toMatchObject({
        biometricKeyThumbprint: 'biometric-1',
        lastUsed: '2026-11-07T12:00:00.000Z',
      })
    })

    it('requires the client id when finding by install key', async () => {
      // Act
      const response = await server.get(`${path}/install-keys/install-1`)

      // Assert
      expect(response.status).toBe(400)
    })

    it('refuses fields it does not take', async () => {
      // Act
      const response = await server
        .put(path)
        .send({ ...registration(), id: 'chosen-by-client' })

      // Assert
      expect(response.status).toBe(400)
    })

    it('deletes a registration', async () => {
      // Arrange
      const saved = await server.put(path).send(registration())

      // Act
      const response = await server.delete(`${path}/${saved.body.id}`)

      // Assert
      expect(response.status).toBe(204)
      expect(await model.count()).toBe(0)
    })
  })

  describe('without auth and permissions', () => {
    it.each`
      method   | endpoint
      ${'GET'} | ${`${path}/install-keys/install-1?clientId=${clientId}`}
      ${'PUT'} | ${path}
    `(
      '$method $endpoint should return 401 when not authenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupAppWithoutAuth({
          AppModule,
          SequelizeConfigService,
          dbType: 'postgres',
        })
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(401)

        await app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${`${path}/install-keys/install-1?clientId=${clientId}`}
      ${'PUT'} | ${path}
    `(
      '$method $endpoint should return 403 without the IdentityServer scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser(),
          dbType: 'postgres',
        })
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(403)

        await app.cleanUp()
      },
    )
  })
})
