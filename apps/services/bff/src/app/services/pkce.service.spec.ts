import { Test, TestingModule } from '@nestjs/testing'
import { PKCEService } from './pkce.service'

const ALLOWED_VERIFIER_CHARACTERS_REGEX = /^[a-zA-Z0-9-._~]+$/

describe('PKCEService', () => {
  let service: PKCEService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PKCEService],
    }).compile()

    service = module.get<PKCEService>(PKCEService)
  })

  describe('generateVerifier', () => {
    const verifierTestCases = [
      { length: 50, description: 'default length 50' },
      { length: 64, description: 'specified length 64' },
    ]

    verifierTestCases.forEach(({ length, description }) => {
      it(`should generate a verifier of ${description}`, async () => {
        const verifier = await service.generateVerifier(length)
        expect(verifier).toHaveLength(length)
        // Check allowed characters
        expect(verifier).toMatch(ALLOWED_VERIFIER_CHARACTERS_REGEX)
      })
    })
  })

  describe('generateCodeVerifier', () => {
    it('should generate a code verifier of default length 50', async () => {
      const verifier = await service.generateCodeVerifier()
      expect(verifier).toHaveLength(50)
      // Check allowed characters
      expect(verifier).toMatch(ALLOWED_VERIFIER_CHARACTERS_REGEX)
    })
  })

  describe('generateCodeChallenge', () => {
    it('should generate a valid code challenge from a given verifier', async () => {
      const verifier = 'testVerifier123'
      const challenge = await service.generateCodeChallenge(verifier)
      expect(challenge).toBeDefined()
      // Match base64url format
      expect(challenge).toMatch(/^[a-zA-Z0-9-_]+$/)
    })
  })

  describe('getRandomValues', () => {
    it('should generate an array of random values of specified length', async () => {
      const length = 10
      const randomValues = await service.getRandomValues(length)
      expect(randomValues).toBeInstanceOf(Uint8Array)
      expect(randomValues).toHaveLength(length)
    })
  })
})