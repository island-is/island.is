import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { decode, verify, type JwtPayload } from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'

import type {
  CibaPollResult,
  CibaStartRequest,
  CibaStartResult,
  StepUpClaims,
} from './types'

export interface CibaClientOptions {
  /** The identity server, e.g. https://innskra.island.is */
  issuer: string
  /** This service's own CIBA client. Each consumer has its own. */
  clientId: string
  clientSecret?: string
  /** Scopes to request, e.g. "openid @island.is/auth/delegation-confirmation". */
  scope: string
  /** The assurance level the person must authenticate at. */
  requiredAcr: string
}

const JWKS_PATH = '/.well-known/openid-configuration/jwks'
const CIBA_GRANT_TYPE = 'urn:openid:params:grant-type:ciba'

/**
 * One service's side of OpenID Connect CIBA against the identity server: start
 * an authentication for the person a user token belongs to, then poll for the
 * result.
 *
 * The person is never named by us. We pass the access token of the user we are
 * serving as login_hint_token, and the identity server authenticates whoever is
 * behind it (the actor, for a delegation). So a client can only reach people it
 * is serving right now.
 *
 * The token that comes back is verified here — signature against the identity
 * server's published keys, issuer, expiry, and that it was issued to this client
 * — so nothing downstream has to trust the transport. It is read once and never
 * stored.
 *
 * Each consumer constructs its own, with its own client: a client is the party
 * that acts on the result, so they are kept apart.
 */
export class CibaClient {
  private readonly jwksClient: JwksClient

  constructor(private readonly options: CibaClientOptions) {
    this.jwksClient = new JwksClient({
      jwksUri: `${options.issuer}${JWKS_PATH}`,
      cache: true,
      rateLimit: true,
    })
  }

  async start(request: CibaStartRequest): Promise<CibaStartResult> {
    const body = this.clientCredentials()
    body.set('scope', this.options.scope)
    body.set('login_hint_token', stripBearer(request.userToken))
    body.set('binding_message', request.bindingMessage)
    body.set('acr_values', this.options.requiredAcr)
    if (request.methodHint) {
      body.set('login_method_hint', request.methodHint)
    }

    const { status, json } = await this.post('/connect/ciba', body)

    if (status === 200) {
      return {
        authReqId: String(json['auth_req_id']),
        method: json['login_method'] === 'sim' ? 'sim' : 'app',
        expiresIn: Number(json['expires_in']),
        interval: Number(json['interval'] ?? 5),
        verificationCode:
          typeof json['verification_code'] === 'string'
            ? json['verification_code']
            : undefined,
      }
    }

    if (status >= 500) {
      throw new ServiceUnavailableException(
        'The identity server could not start the authentication.',
      )
    }

    // invalid_request, unknown_user_id, access_denied (feature off), ...
    throw new BadRequestException(
      `The authentication could not be started: ${json['error'] ?? status}${
        json['error_description'] ? ` (${json['error_description']})` : ''
      }`,
    )
  }

  async poll(authReqId: string): Promise<CibaPollResult> {
    const body = this.clientCredentials()
    body.set('grant_type', CIBA_GRANT_TYPE)
    body.set('auth_req_id', authReqId)

    const { status, json } = await this.post('/connect/token', body)

    if (status === 200 && typeof json['access_token'] === 'string') {
      return {
        status: 'authenticated',
        claims: await this.verifyAccessToken(json['access_token']),
      }
    }

    switch (json['error']) {
      case 'authorization_pending':
      case 'slow_down':
        return { status: 'pending' }
      case 'access_denied':
        return { status: 'denied' }
      case 'expired_token':
      case 'invalid_grant':
        return { status: 'expired' }
    }

    if (status >= 500) {
      throw new ServiceUnavailableException(
        'The identity server could not report on the authentication.',
      )
    }

    throw new BadRequestException(
      `Unexpected response from the identity server: ${
        json['error'] ?? status
      }`,
    )
  }

  private async verifyAccessToken(token: string): Promise<StepUpClaims> {
    const header = decode(token, { complete: true })?.header
    if (!header?.kid) {
      throw new BadRequestException('The identity server token has no key id.')
    }

    const key = await this.jwksClient.getSigningKey(header.kid)
    const payload = verify(token, key.getPublicKey(), {
      issuer: this.options.issuer,
      algorithms: ['RS256', 'PS256', 'ES256'],
    }) as JwtPayload

    if (payload['client_id'] !== this.options.clientId) {
      throw new BadRequestException(
        'The identity server token was issued to a different client.',
      )
    }

    if (typeof payload['nationalId'] !== 'string' || !payload.sub) {
      throw new BadRequestException(
        'The identity server token does not name the person.',
      )
    }

    if (typeof payload['auth_time'] !== 'number') {
      throw new BadRequestException(
        'The identity server token does not say when the person authenticated.',
      )
    }

    return {
      sub: payload.sub,
      nationalId: payload['nationalId'],
      acr: typeof payload['acr'] === 'string' ? payload['acr'] : undefined,
      amr: Array.isArray(payload['amr'])
        ? payload['amr'].map(String)
        : payload['amr']
        ? [String(payload['amr'])]
        : [],
      authTime: new Date(payload['auth_time'] * 1000),
      certificateThumbprint:
        typeof payload['audkenni_certificate_sha256'] === 'string'
          ? payload['audkenni_certificate_sha256']
          : undefined,
    }
  }

  private clientCredentials() {
    if (!this.options.clientSecret) {
      throw new ServiceUnavailableException(
        `Step-up client ${this.options.clientId} has no client secret configured.`,
      )
    }

    return new URLSearchParams({
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
    })
  }

  private async post(
    path: string,
    body: URLSearchParams,
  ): Promise<{ status: number; json: Record<string, unknown> }> {
    let response: Response
    try {
      response = await fetch(`${this.options.issuer}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
    } catch {
      throw new ServiceUnavailableException(
        'The identity server could not be reached.',
      )
    }

    const json = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >

    return { status: response.status, json }
  }
}

/** User.authorization carries the scheme; the identity server wants the token. */
const stripBearer = (authorization: string) =>
  authorization.replace(/^Bearer\s+/i, '')
