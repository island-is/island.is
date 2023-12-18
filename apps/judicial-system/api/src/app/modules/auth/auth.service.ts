import fetch from 'isomorphic-fetch'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { uuid } from 'uuidv4'

import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  EventType,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { DefenderService } from '../defender/defender.service'
import { authModuleConfig } from './auth.config'

@Injectable()
export class AuthService {
  constructor(
    private readonly defenderService: DefenderService,
    @Inject(authModuleConfig.KEY)
    private readonly config: ConfigType<typeof authModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async findUser(nationalId: string): Promise<User | undefined> {
    const res = await fetch(
      `${this.config.backendUrl}/api/user/?nationalId=${nationalId}`,
      {
        headers: { authorization: `Bearer ${this.config.secretToken}` },
      },
    )

    if (!res.ok) {
      return undefined
    }

    return await res.json()
  }

  async findDefender(nationalId: string): Promise<User | undefined> {
    try {
      const res = await fetch(
        `${this.config.backendUrl}/api/cases/limitedAccess/defender?nationalId=${nationalId}`,
        {
          headers: { authorization: `Bearer ${this.config.secretToken}` },
        },
      )
      if (res.ok) {
        return await res.json()
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.info('Defender not found', error)
      } else throw error
    }

    // If a defender doesn't have any active cases, we look them up
    // in the lawyer registry because we want to at least display an empty
    // case list for them to avoid confusion about them not having access to
    // the judicial system
    try {
      const lawyerRegistryInfo = await this.defenderService.getLawyer(
        nationalId,
      )
      if (lawyerRegistryInfo && lawyerRegistryInfo.nationalId === nationalId) {
        return {
          // Reason for this is so we trust the nationalId from the authentication provider
          // just in case the lawyer registry does something strange, we don't want to create
          // a user with a nationalId that is not the same as the one from the authentication provider
          nationalId: nationalId,
          name: lawyerRegistryInfo.name,
          role: UserRole.DEFENDER,
          email: lawyerRegistryInfo.email,
          mobileNumber: lawyerRegistryInfo.phoneNr,
          active: true,
          title: 'verjandi',
          id: uuid(),
          created: new Date().toString(),
          modified: new Date().toString(),
        } as User
      }
    } catch (error) {
      this.logger.info(
        'Error when looking up defender in lawyer registry',
        error,
      )
    }

    return undefined
  }

  async fetchIdsToken(code: string, codeVerifier: string) {
    const requestBody = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      code: code,
      redirect_uri: this.config.redirectUri,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
    })

    const response = await fetch(`${this.config.issuer}/connect/token`, {
      method: 'POST',
      body: requestBody,
    })

    if (response.ok) {
      return await response.json()
    } else {
      throw new UnauthorizedException(
        `Authorization request failed with status ${response.status} - ${response.statusText}`,
      )
    }
  }

  async verifyIdsToken(token: string) {
    try {
      const secretClient = jwksClient({
        cache: true,
        rateLimit: true,
        jwksUri: `${this.config.issuer}/.well-known/openid-configuration/jwks`,
      })

      const decodedToken = jwt.decode(token, { complete: true })
      const tokenHeader = decodedToken?.header

      if (!tokenHeader) {
        throw new Error('Invalid access token header')
      }

      const signingKeys = await secretClient.getSigningKeys()
      const matchingKey = signingKeys.find((sk) => sk.kid === tokenHeader.kid)

      if (!matchingKey) {
        throw new Error(`No matching key found for kid ${tokenHeader.kid}`)
      }

      const publicKey = matchingKey.getPublicKey()

      const verifiedToken = jwt.verify(token, publicKey, {
        issuer: this.config.issuer,
        clockTimestamp: Date.now() / 1000,
        ignoreNotBefore: false,
        audience: this.config.clientId,
      })

      return verifiedToken as {
        nationalId: string
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      throw error
    }
  }

  async logLogin(
    eventType: EventType,
    nationalId: string,
    userRole?: UserRole,
  ) {
    await fetch(`${this.config.backendUrl}/api/event-log/log-event`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.config.secretToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        nationalId,
        userRole,
      }),
    })
  }

  validateUser(user: User): boolean {
    return user.active
  }
}
