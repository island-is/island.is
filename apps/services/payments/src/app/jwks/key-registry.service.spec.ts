import { TestApp, testServer } from '@island.is/testing/nest'
import { generateKeyPairSync } from 'crypto'
import { KeyRegistryService } from './key-registry.service'
import { JwksModule } from './jwks.module'
import { JwksConfigType } from './jwks.config'

const toBase64 = (str: string) => Buffer.from(str).toString('base64')

const jwtConfigKeyToProcessEnvKey = (key: keyof JwksConfigType) => {
  switch (key) {
    case 'expiresInMinutes':
      return 'PAYMENTS_JWT_SIGNING_EXPIRES_IN_MINUTES'
    case 'issuer':
      return 'PAYMENTS_WEB_URL'
    case 'keyId':
      return 'PAYMENTS_JWT_SIGNING_KEY_ID'
    case 'privateKey':
      return 'PAYMENTS_JWT_SIGNING_PRIVATE_KEY'
    case 'publicKey':
      return 'PAYMENTS_JWT_SIGNING_PUBLIC_KEY'
    case 'previousPublicKeyId':
      return 'PAYMENTS_PREVIOUS_KEY_ID'
    case 'previousPublicKey':
      return 'PAYMENTS_PREVIOUS_PUBLIC_KEY'
    default:
      throw new Error(`Unknown JWT config key: ${key}`)
  }
}

const setJwtEnvironmentVariables = (state: Partial<JwksConfigType>) => {
  for (const key in state) {
    const processEnvKey = jwtConfigKeyToProcessEnvKey(
      key as keyof JwksConfigType,
    )
    process.env[processEnvKey] =
      state[key as keyof JwksConfigType]?.toString() ?? ''
  }
}

describe('KeyRegistryService', () => {
  let app: TestApp
  let service: KeyRegistryService
  let currentKeyPair: { privateKey: string; publicKey: string }
  let previousKeyPair: { privateKey: string; publicKey: string }
  let originalEnv: NodeJS.ProcessEnv
  let currentState: JwksConfigType

  const setup = async (state: Partial<JwksConfigType>) => {
    setJwtEnvironmentVariables(state)

    app = await testServer({
      appModule: JwksModule,
    })

    service = app.get<KeyRegistryService>(KeyRegistryService)

    await service.initialize()
  }

  beforeAll(async () => {
    // Store original env
    originalEnv = { ...process.env }

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
  })

  afterEach(() => {
    app?.cleanUp()
    jest.resetAllMocks()
    // Restore original environment
    process.env = originalEnv
  })

  describe('getJwks', () => {
    it('should return single JWK when only current key is configured', async () => {
      currentState = {
        ...currentState,
        keyId: 'current-key',
        previousPublicKeyId: undefined,
        previousPublicKey: undefined,
      }

      await setup(currentState)

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
      currentState = {
        issuer: 'test-issuer',
        keyId: 'current-key',
        privateKey: toBase64(currentKeyPair.privateKey),
        publicKey: toBase64(currentKeyPair.publicKey),
        expiresInMinutes: 5,
        previousPublicKeyId: 'previous-key',
        previousPublicKey: toBase64(previousKeyPair.publicKey),
      }

      await setup(currentState)

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
