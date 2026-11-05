import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import jwt from 'jsonwebtoken'
import type { AuthConfig } from './auth.module'
import { JwtPayload } from './jwt.payload'
import { Auth } from './auth'
import { createKeyProvider } from './create-key-provider'
import { DpopError, DpopReplayCache, verifyDpopProof } from './dpop'

const AUTH_BODY_FIELD_NAME = '__accessToken'

const DPOP_SCHEME = /^DPoP\s+(\S+)$/i
const BEARER_SCHEME = /^Bearer\s+(\S+)$/i

/**
 * The identity server signs other JWTs with the same key, such as a native app's
 * client attestation. Only access tokens are accepted.
 */
const ACCESS_TOKEN_TYPES = ['at+jwt', 'application/at+jwt', 'jwt']

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly dpopReplayCache = new DpopReplayCache()
  /** Guards run per GraphQL root field, so one request can be validated many times. */
  private readonly verifiedProofs = new WeakMap<Request, string>()

  constructor(private config: AuthConfig) {
    super({
      secretOrKeyProvider: createKeyProvider(config.issuer),
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromAuthHeaderWithScheme('DPoP'),
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
    const header = request.headers?.authorization
    const dpopToken = header?.match(DPOP_SCHEME)?.[1]
    const bearerToken = header?.match(BEARER_SCHEME)?.[1]

    // passport-jwt reads the first two words of any header, so anything but
    // exactly "<scheme> <token>" would let a token through unchecked here.
    if (header && !dpopToken && !bearerToken) {
      throw new UnauthorizedException('Malformed authorization header')
    }

    this.checkTokenType(dpopToken ?? bearerToken ?? bodyAuthorization)
    this.checkDpop(request, payload, dpopToken)

    // Forwarded to other services as Bearer: the proof was for this request only.
    const authorization =
      (dpopToken && `Bearer ${dpopToken}`) ||
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
      acr: payload.acr,
      idp: payload.idp,
      authTime: payload.auth_time
        ? new Date(payload.auth_time * 1000)
        : undefined,
      dpopJkt: payload.cnf?.jkt,
    }
  }

  private checkTokenType(token: string | undefined) {
    if (!token) return

    const typ = jwt.decode(token, { complete: true })?.header.typ
    if (typ && !ACCESS_TOKEN_TYPES.includes(typ.toLowerCase())) {
      throw new UnauthorizedException('Not an access token')
    }
  }

  /**
   * A token sent with the DPoP scheme must come with a proof from the key it is
   * bound to. A bound token sent as Bearer is refused only where configured.
   */
  private checkDpop(
    request: Request,
    payload: JwtPayload,
    dpopToken: string | undefined,
  ) {
    const boundKey = payload.cnf?.jkt

    if (!dpopToken) {
      if (boundKey && this.config.requireDpopForBoundTokens) {
        throw new UnauthorizedException(
          'This token is DPoP-bound: send it with the DPoP scheme and a proof',
        )
      }
      return
    }

    if (!boundKey) {
      throw new UnauthorizedException(
        'The DPoP scheme needs a DPoP-bound token',
      )
    }

    // The same request and proof, already verified: not a replay.
    const proof = request.headers['dpop']
    if (
      typeof proof === 'string' &&
      this.verifiedProofs.get(request) === proof
    ) {
      return
    }

    try {
      verifyDpopProof({
        request,
        accessToken: dpopToken,
        boundKey,
        replayCache: this.dpopReplayCache,
      })
      this.verifiedProofs.set(request, proof as string)
    } catch (error) {
      if (error instanceof DpopError) {
        throw new UnauthorizedException(error.message)
      }
      throw error
    }
  }
}
