import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Cache as CacheManager } from 'cache-manager'
import { InferAttributes, InferCreationAttributes, Op } from 'sequelize'
import addDays from 'date-fns/addDays'

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
  VerifyRegistrationResponseOpts,
} from '@simplewebauthn/server'

import type {
  RegistrationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
  PublicKeyCredentialCreationOptionsJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/types'

import type { User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { PasskeyModel } from './models/passkey.model'
import { getTokenInfo, getUserId } from './passkeys-core.utils'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { PasskeysCoreConfig } from './passkeys-core.config'
import { ConfigType } from '@nestjs/config'

const PASSKEY_TYPE = 'IslandApp'

@Injectable()
export class PasskeysCoreService {
  constructor(
    @InjectModel(PasskeyModel)
    private passkeyModel: typeof PasskeyModel,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,
    @Inject(PasskeysCoreConfig.KEY)
    private readonly config: ConfigType<typeof PasskeysCoreConfig>,
  ) {}

  async generateRegistrationOptions(user: User) {
    const tokenInfo = getTokenInfo(user.authorization)

    const opts: GenerateRegistrationOptionsOpts = {
      rpName: this.config.passkey.rpName,
      rpID: this.config.passkey.rpId,
      userName: tokenInfo.name,
      timeout: 60000,
      attestationType: 'direct',
      authenticatorSelection: {
        residentKey: 'discouraged',
        userVerification: 'required',
      },
      // ES256 and RS256
      supportedAlgorithmIDs: [-7, -257],
    }

    const options = await generateRegistrationOptions(opts)

    // Save to redis
    await this.saveToCache(getUserId(user), options.challenge)

    return {
      ...options,
      user: {
        ...options.user,
        displayName: tokenInfo.name,
      },
    } as PublicKeyCredentialCreationOptionsJSON
  }

  async verifyRegistration(
    user: User,
    verificationResponse: RegistrationResponseJSON,
  ) {
    const tokenInfo = getTokenInfo(user.authorization)

    const expectedChallenge = await this.getFromCache(getUserId(user))

    let verification: VerifiedRegistrationResponse | undefined
    try {
      const verificationOptions: VerifyRegistrationResponseOpts = {
        response: verificationResponse,
        expectedChallenge,
        expectedOrigin: this.config.passkey.allowedOrigins,
        expectedRPID: this.config.passkey.rpId,
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
      type: PASSKEY_TYPE,
      audkenni_sim_number: user.audkenniSimNumber ?? '',
      name: tokenInfo.name,
      idp: tokenInfo.idp,
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
        created: {
          [Op.gte]: addDays(new Date(), -this.config.passkey.maxAgeDays),
        },
      },
    })

    if (!passkey) {
      throw new BadRequestException('Passkey not found')
    }

    // Generate the authentication options
    const options = await generateAuthenticationOptions({
      rpID: this.config.passkey.rpId,
      allowCredentials: [
        {
          id: passkey.passkey_id,
          transports: ['internal'],
        },
      ],
    })

    // Save to redis
    await this.saveToCache(options.challenge, passkey.passkey_id)

    return options
  }

  async verifyAuthenticationString(responseAsString: string) {
    try {
      const decodedJson = Buffer.from(responseAsString, 'base64').toString(
        'utf-8',
      )
      const parsedJson = JSON.parse(decodedJson) as AuthenticationResponseJSON

      return this.verifyAuthentication(parsedJson)
    } catch (e) {
      this.logger.error('Invalid passkey format', e)
      throw new BadRequestException('Invalid passkey format')
    }
  }

  async verifyAuthentication(response: AuthenticationResponseJSON) {
    const passkey = await this.passkeyModel.findOne({
      where: {
        passkey_id: response.id,
        created: {
          [Op.gte]: addDays(new Date(), -this.config.passkey.maxAgeDays),
        },
      },
    })

    if (!passkey) {
      throw new BadRequestException('Passkey not found')
    }

    let challenge: string

    try {
      challenge = JSON.parse(
        Buffer.from(response.response.clientDataJSON, 'base64').toString(
          'utf-8',
        ),
      ).challenge
    } catch (e) {
      this.logger.log('Invalid clientDataJSON', e)
      throw new BadRequestException('Invalid clientDataJSON')
    }

    const expectedPasskeyId = await this.getFromCache(challenge)

    if (expectedPasskeyId !== passkey.passkey_id) {
      throw new BadRequestException('Passkey not found')
    }

    let verification
    try {
      verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge: challenge,
        expectedOrigin: this.config.passkey.allowedOrigins,
        expectedRPID: this.config.passkey.rpId,
        authenticator: {
          credentialID: passkey.passkey_id,
          credentialPublicKey: passkey.public_key,
          counter: 0, // TODO: Store in db and increment on authentication
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
      idp: passkey.idp,
      sub: passkey.user_sub,
    }
  }

  async deletePasskeyById(passkeyId: string) {
    await this.passkeyModel.destroy({
      where: {
        passkey_id: passkeyId,
      },
    })
  }

  async deletePasskeyByUser(user: User) {
    await this.passkeyModel.destroy({
      where: {
        user_sub: getUserId(user),
      },
    })
  }

  private async saveToCache(
    key: string,
    value: string,
    ttl = this.config.passkey.challengeTtl,
  ) {
    await this.cacheManager.set(key, value, ttl)
  }

  private async getFromCache(key: string, deleteAfterGetting = true) {
    const value = await this.cacheManager.get(key)

    if (!value || typeof value !== 'string' || !value.length) {
      throw new BadRequestException('Not found')
    }

    if (deleteAfterGetting) {
      await this.cacheManager.del(key)
    }

    return value
  }
}
