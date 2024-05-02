import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Cache as CacheManager } from 'cache-manager'
import type { User } from '@island.is/auth-nest-tools'

import {
  // Authentication
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  // Registration
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'

import type {
  GenerateRegistrationOptionsOpts,
  VerifiedRegistrationResponse,
} from '@simplewebauthn/server'

import type {
  RegistrationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/types'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { PasskeyModel } from './models/passkey.model'
import { getUserId } from './passkeys-core.utils'

// TODO read from env
const RP_ID = 'localhost'

// TODO read from env
const ALLOWED_ORIGIN = 'http://localhost:4200'

const CACHE_MANAGER = 'CACHE_MANAGER'

// TODO read from env
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
    await this.saveChallenge(getUserId(user), options.challenge, 'reg')

    return options
  }

  async verifyRegistration(
    user: User,
    verificationResponse: RegistrationResponseJSON,
  ) {
    const expectedChallenge = await this.getChallenge(getUserId(user), 'reg')

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
      this.logger.error('Registration verification failed', e)
      throw new BadRequestException('Registration verification failed')
    }

    const { verified, registrationInfo } = verification

    const success = verified && registrationInfo

    if (!success) {
      throw new BadRequestException('Registration verification failed')
    }

    const passkey = {
      passkey_id: registrationInfo.credentialID,
      public_key: Buffer.from(registrationInfo.credentialPublicKey),
      user_sub: getUserId(user),
      type: 'IslandApp',
      audkenni_sim_number: user.audkenniSimNumber ?? '',
      name: 'TODO',
      idp: 'TODO',
    }

    await this.passkeyModel.upsert(passkey, {
      conflictFields: ['user_sub', 'type'],
    })

    return { verified }
  }

  async generateAuthenticationOptions(
    user: User,
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    const passkey = await this.passkeyModel.findOne({
      where: {
        user_sub: user.sub,
      },
    })

    if (!passkey) {
      throw new BadRequestException('Passkey not found')
    }

    // Generate the authentication options
    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials: [
        {
          id: passkey.passkey_id,
          transports: ['internal'],
        },
      ],
    })

    // Save to redis
    await this.saveChallenge(getUserId(user), options.challenge, 'auth')

    return options
  }

  async verifyAuthentication(user: User, response: AuthenticationResponseJSON) {
    const expectedChallenge = await this.getChallenge(getUserId(user), 'auth')

    const passkey = await this.passkeyModel.findOne({
      where: {
        user_sub: user.sub,
      },
    })

    if (!passkey) {
      throw new BadRequestException('Passkey not found')
    }

    let verification
    try {
      verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge,
        expectedOrigin: ALLOWED_ORIGIN,
        expectedRPID: RP_ID,
        authenticator: {
          credentialID: passkey.id,
          credentialPublicKey: passkey.public_key,
          // TODO
          counter: 0,
          transports: ['internal'],
        },
      })
    } catch (error) {
      this.logger.error('Auth verification failed', error)
      throw new BadRequestException('Auth verification failed')
    }

    const { verified } = verification

    if (!verified) {
      throw new BadRequestException('Auth verification failed')
    }

    return {
      verified,
    }
  }

  async deletePasskey(passkeyId: string) {
    await this.passkeyModel.destroy({
      where: {
        passkey_id: passkeyId,
      },
    })
  }

  private async saveChallenge(
    userId: string,
    challenge: string,
    type: 'reg' | 'auth',
  ) {
    await this.cacheManager.set(`${type}_${userId}`, challenge, CHALLENGE_TTL)
  }

  private async getChallenge(userId: string, type: 'reg' | 'auth') {
    const key = `${type}_${userId}`
    const storedChallenge = await this.cacheManager.get(key)

    if (
      !storedChallenge ||
      typeof storedChallenge !== 'string' ||
      !storedChallenge.length
    ) {
      throw new BadRequestException('No stored challenge found')
    }

    await this.cacheManager.del(key)

    return storedChallenge
  }
}
