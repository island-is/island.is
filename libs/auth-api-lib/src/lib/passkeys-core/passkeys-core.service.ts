import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import { InjectModel } from '@nestjs/sequelize'
import { Cache as CacheManager } from 'cache-manager'

import {
  // Authentication
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  // Registration
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'

// import { verifyAttestation } from 'node-app-attest'

import type {
  GenerateRegistrationOptionsOpts,
  VerifiedRegistrationResponse,
} from '@simplewebauthn/server'

import type {
  RegistrationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
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
      // TODO?
      // excludeCredentials: [ ... ]
    }

    const options = await generateRegistrationOptions(opts)

    // Save to redis
    await this.saveToCache(getUserId(user), options.challenge)

    return options
  }

  async verifyRegistration(
    user: User,
    verificationResponse: RegistrationResponseJSON,
  ) {
    const tokenInfo = getTokenInfo(user.authorization)

    const expectedChallenge = await this.getFromCache(getUserId(user))

    // try {
    //   const { keyId, publicKey } = verifyAttestation({
    //     attestation: verificationResponse.response.attestationObject,
    //     challenge: expectedChallenge,
    //     keyId: 'test',
    //     bundleIdentifier: 'is.island.app',
    //     teamIdentifier: 'team.island', // TODO
    //     allowDevelopmentEnvironment: process.env.NODE_ENV === 'development',
    //   })
    // } catch (e) {
    //   throw new BadRequestException('Device verification failed')
    // }

    let verification: VerifiedRegistrationResponse | undefined
    try {
      const verificationOptions = {
        response: verificationResponse,
        expectedChallenge,
        expectedOrigin: this.config.passkey.allowedOrigin,
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

  async verifyAuthentication(response: AuthenticationResponseJSON) {
    const passkey = await this.passkeyModel.findOne({
      where: {
        passkey_id: response.id,
      },
    })

    if (!passkey) {
      throw new BadRequestException('Passkey not found')
    }

    let challenge: string
    try {
      challenge = JSON.parse(atob(response.response.clientDataJSON)).challenge
    } catch {
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
        expectedOrigin: this.config.passkey.allowedOrigin,
        expectedRPID: this.config.passkey.rpId,
        authenticator: {
          credentialID: passkey.id,
          credentialPublicKey: passkey.public_key,
          // TODO?
          counter: 0,
          transports: ['internal'],
        },
      })
    } catch (error) {
      this.logger.error('Auth verification failed', error)
      throw new UnauthorizedException('Auth verification failed')
    }

    const { verified } = verification

    if (!verified) {
      throw new UnauthorizedException('Auth verification failed')
    }

    return {
      verified,
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
