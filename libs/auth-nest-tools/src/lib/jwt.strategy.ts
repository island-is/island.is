import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import type { AuthConfig } from './auth.module'
import { JwtPayload } from './jwt.payload'
import { Auth } from './auth'
import { createKeyProvider } from './create-key-provider'

const AUTH_BODY_FIELD_NAME = '__accessToken'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: AuthConfig) {
    super({
      secretOrKeyProvider: createKeyProvider(config.issuer),
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromBodyField(AUTH_BODY_FIELD_NAME),
      ]),
      ...(config.audience != null &&
        (Array.isArray(config.audience)
          ? config.audience.length > 0
          : true) && {
          audience: config.audience,
        }),
      issuer: config.issuer,
      algorithms: ['RS256'],
      ignoreExpiration: false,
      passReqToCallback: true,
      jsonWebTokenOptions: {
        // Add default clockTolerance of 60 seconds to allow for small time differences between servers
        clockTolerance: 60,
      },
    })
  }

  private parseScopes(scopes: undefined | string | string[]): string[] {
    if (scopes === undefined) {
      return []
    }
    if (typeof scopes === 'string') {
      return scopes.split(' ')
    }
    return scopes
  }

  async validate(request: Request, payload: JwtPayload): Promise<Auth> {
    const actor = payload.actor

    if (this.config.allowClientNationalId && payload.client_nationalId) {
      payload.nationalId = payload.client_nationalId
    }

    const bodyAuthorization = request.body?.[AUTH_BODY_FIELD_NAME]
    const authorization =
      request.headers?.authorization ||
      (bodyAuthorization && `Bearer ${bodyAuthorization}`) ||
      ''

    return {
      sub: payload.sub,
      sid: payload.sid,
      nationalId: payload.nationalId,
      scope: this.parseScopes(payload.scope),
      client: payload.client_id,
      authorization,
      delegationType: payload.delegationType,
      actor: actor && {
        nationalId: actor.nationalId,
        scope: this.parseScopes(actor.scope),
      },
      act: payload.act,
      ip: String(request.headers['x-forwarded-for'] ?? request.ip),
      userAgent: request.headers['user-agent'],
      audkenniSimNumber: payload.audkenni_sim_number,
      delegationProvider: payload.client_delegation_provider,
    }
  }
}
