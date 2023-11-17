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
      audience: config.audience,
      issuer: config.issuer,
      algorithms: ['RS256'],
      ignoreExpiration: false,
      passReqToCallback: true,
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
    return {
      sub: payload.sub,
      nationalId: payload.nationalId,
      scope: this.parseScopes(payload.scope),
      client: payload.client_id,
      authorization: request.headers.authorization ?? '',
      delegationType: payload.delegationType,
      actor: actor && {
        nationalId: actor.nationalId,
        scope: this.parseScopes(actor.scope),
      },
      act: payload.act,
      ip: String(request.headers['x-forwarded-for'] ?? request.ip),
      userAgent: request.headers['user-agent'],
      audkenniSimNumber: payload.audkenni_sim_number,
    }
  }
}
