import { TestApp, testServer } from '@island.is/testing/nest'
import { generateKeyPairSync } from 'crypto'
import { KeyRegistryService } from './key-registry.service'
import { JwksModule } from './jwks.module'
import { environment } from '../../../src/environments'

describe('KeyRegistryService', () => {
  let app: TestApp
  let service: KeyRegistryService
  let currentKeyPair: { privateKey: string; publicKey: string }
  let previousKeyPair: { privateKey: string; publicKey: string }

  beforeAll(async () => {
    // Generate current key pair
    const currentKeys = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    })

    // Generate previous key pair
    const previousKeys = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    })

    currentKeyPair = {
      privateKey: currentKeys.privateKey,
      publicKey: currentKeys.publicKey,
    }

    previousKeyPair = {
      privateKey: previousKeys.privateKey,
      publicKey: previousKeys.publicKey,
    }

    app = await testServer({
      appModule: JwksModule,
    })

    service = app.get<KeyRegistryService>(KeyRegistryService)
  })

  let envBefore: string

  beforeEach(() => {
    envBefore = JSON.stringify(environment.jwtSigning)
  })

  afterEach(() => {
    environment.jwtSigning = JSON.parse(envBefore)
  })

  afterAll(() => {
    app?.cleanUp()
  })

  describe('getJwks', () => {
    it('should return single JWK when only current key is configured', async () => {
      environment.jwtSigning.issuer = 'test-issuer'
      environment.jwtSigning.keyId = 'current-key'
      environment.jwtSigning.privateKey = currentKeyPair.privateKey
      environment.jwtSigning.publicKey = currentKeyPair.publicKey
      environment.jwtSigning.expiresInMinutes = 5
      environment.jwtSigning.previousPublicKeyId = undefined
      environment.jwtSigning.previousPublicKey = undefined

      await service.initialize()

      const result = await service.getJwks()

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
      environment.jwtSigning.issuer = 'test-issuer'
      environment.jwtSigning.keyId = 'current-key'
      environment.jwtSigning.privateKey = currentKeyPair.privateKey
      environment.jwtSigning.publicKey = currentKeyPair.publicKey
      environment.jwtSigning.expiresInMinutes = 5
      environment.jwtSigning.previousPublicKeyId = 'previous-key'
      environment.jwtSigning.previousPublicKey = previousKeyPair.publicKey

      await service.initialize()

      const result = await service.getJwks()

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
