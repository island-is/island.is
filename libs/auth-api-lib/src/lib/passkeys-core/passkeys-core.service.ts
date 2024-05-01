import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Cache as CacheManager } from 'cache-manager'
import type { User } from '@island.is/auth-nest-tools'

import {
  // Authentication
  generateAuthenticationOptions,
  // Registration
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'

import type {
  GenerateRegistrationOptionsOpts,
  VerifiedRegistrationResponse,
} from '@simplewebauthn/server'

import type { RegistrationResponseJSON } from '@simplewebauthn/types'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { PasskeyModel } from './models/passkey.model'
import { PasskeyDTO } from './dto/passkey.dto'

const RP_ID = 'localhost'

const ALLOWED_ORIGIN = 'http://localhost:4200'

const CACHE_MANAGER = 'CACHE_MANAGER'

const CHALLENGE_TTL = 15 * 60 * 1000

@Injectable()
export class PasskeysCoreService {
  constructor(
    @Inject(Sequelize)
    private sequelize: Sequelize,
    @InjectModel(PasskeyModel)
    private passkeyModel: typeof PasskeyModel,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,
  ) {
    this.logger.info('PasskeysCoreService initialized')
  }

  async generateRegistrationOptions(user: User) {
    const opts: GenerateRegistrationOptionsOpts = {
      rpName: 'Island.is',
      rpID: RP_ID,
      userName: 'Test User',
      timeout: 60000,
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'discouraged',
        userVerification: 'required',
      },
      // ES256 and RS256
      supportedAlgorithmIDs: [-7, -257],
    }

    const options = await generateRegistrationOptions(opts)

    // Save to redis
    await this.cacheManager.set(user.sub!, options.challenge, CHALLENGE_TTL)

    return options
  }

  async verifyRegistration(
    user: User,
    verificationResponse: RegistrationResponseJSON,
  ) {
    const expectedChallenge = (await this.cacheManager.get(user.sub!)) as
      | string
      | undefined

    if (!expectedChallenge) {
      throw new Error('Challenge not found')
    }

    await this.cacheManager.del(user.sub!)

    let verification: VerifiedRegistrationResponse | undefined
    try {
      const verificationOptions = {
        response: verificationResponse,
        expectedChallenge,
        expectedOrigin: ALLOWED_ORIGIN,
        expectedRPID: RP_ID,
        requireUserVerification: false,
      }

      verification = await verifyRegistrationResponse(verificationOptions)
    } catch (e) {
      throw e
    }

    const { verified, registrationInfo } = verification

    const success = verified && registrationInfo

    if (!success) {
      throw new Error('Verification failed')
    }

    const normalisedPublicKey = String.fromCharCode(
      ...Object.values(registrationInfo.credentialPublicKey),
    )

    const byteObject = {} as any
    for (let i = 0; i < normalisedPublicKey.length; i++) {
      byteObject[i] = normalisedPublicKey.charCodeAt(i)
    }

    const serialisedAgain = byteObject

    const areObjectsEqual = (a: object, b: object) =>
      JSON.stringify(a) === JSON.stringify(b)

    const passkey = {
      passkey_id: registrationInfo.credentialID,
      public_key: normalisedPublicKey,
      user_sub: user.sub!,
      type: 'IslandApp',
      audkenni_sim_number: user.audkenniSimNumber ?? '',
      name: 'TODO',
      idp: 'TODO',
    }

    await this.passkeyModel.upsert(passkey)

    return { verified }
  }

  async generateAuthenticationOptions() {}

  async verifyAuthentication() {}

  async verifyChallenge(userId: string, challenge: string) {
    const storedChallenge = await this.cacheManager.get(userId)

    await this.cacheManager.del(userId)

    return storedChallenge === challenge
  }

  async registerPasskey(passkey: PasskeyDTO) {
    await this.passkeyModel.upsert({
      ...passkey,
      audkenni_sim_number: passkey.audkenni_sim_number ?? '',
    })
  }

  async deletePasskey(passkeyId: string) {
    await this.passkeyModel.destroy({
      where: {
        passkey_id: passkeyId,
      },
    })
  }

  async handleChallenges() {
    return 'handleChallenges'
  }

  async validateAuthentication() {
    return 'validateAuthentication'
  }

  async validatePasskey() {
    return 'validatePasskey'
  }
}
