import { TestApp, testServer } from '@island.is/testing/nest'
import { JwksController } from './jwks.controller'
import { JwksModule } from './jwks.module'
import { KeyRegistryService } from './key-registry.service'

describe('JwksController', () => {
  let app: TestApp
  let controller: JwksController
  let keyRegistryService: KeyRegistryService

  beforeAll(async () => {
    app = await testServer({
      appModule: JwksModule,
    })

    controller = app.get<JwksController>(JwksController)
    keyRegistryService = app.get<KeyRegistryService>(KeyRegistryService)
  })

  afterAll(() => {
    app?.cleanUp()
  })

  describe('serveJwks', () => {
    it('should return single JWK when only current key is configured', async () => {
      jest.spyOn(keyRegistryService, 'getJwks').mockResolvedValue({
        keys: [
          {
            kty: 'RSA',
            kid: 'current-key',
            use: 'sig',
            alg: 'RS256',
            n: 'test-modulus',
            e: 'AQAB',
          },
        ],
      })

      const result = await controller.serveJwks()

      expect(result).toBeDefined()
      expect(result.keys).toHaveLength(1)
      expect(result.keys[0]).toMatchObject({
        kty: 'RSA',
        kid: 'current-key',
        use: 'sig',
        alg: 'RS256',
      })
    })

    it('should return two JWKs when both current and previous keys are configured', async () => {
      jest.spyOn(keyRegistryService, 'getJwks').mockResolvedValue({
        keys: [
          {
            kty: 'RSA',
            kid: 'current-key',
            use: 'sig',
            alg: 'RS256',
            n: 'test-modulus-1',
            e: 'AQAB',
          },
          {
            kty: 'RSA',
            kid: 'previous-key',
            use: 'sig',
            alg: 'RS256',
            n: 'test-modulus-2',
            e: 'AQAB',
          },
        ],
      })

      const result = await controller.serveJwks()

      expect(result).toBeDefined()
      expect(result.keys).toHaveLength(2)
      expect(result.keys).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            kty: 'RSA',
            kid: 'current-key',
            use: 'sig',
            alg: 'RS256',
          }),
          expect.objectContaining({
            kty: 'RSA',
            kid: 'previous-key',
            use: 'sig',
            alg: 'RS256',
          }),
        ]),
      )
    })
  })
})
