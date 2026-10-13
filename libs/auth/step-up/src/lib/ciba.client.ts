import {
  BadRequestException,
  ForbiddenException,
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
  issuer: string
  clientId: string
  clientSecret?: string
  scope: string
  requiredAcr: string
  timeoutMs?: number
}

const DEFAULT_TIMEOUT_MS = 10_000

/** Refusals that retrying from the same session will not fix. */
export class SessionCannotStepUpError extends ForbiddenException {
  constructor() {
    super(
      'This session can not be stepped up, e.g. because it was logged in with an ID card.',
    )
  }
}

export class StepUpUnavailableError extends ForbiddenException {
  constructor() {
    super('Step-up is not available for this person right now.')
  }
}

/** The IDS hands out a token once, so a rejected one is final, unlike an outage. */
export class StepUpTokenRejectedError extends BadRequestException {
  constructor(reason: string) {
    super(`The identity server token was rejected: ${reason}`)
  }
}

const SESSION_CANNOT_STEP_UP = 'session_cannot_step_up'
const STEP_UP_UNAVAILABLE = 'step_up_unavailable'

const JWKS_PATH = '/.well-known/openid-configuration/jwks'
const CIBA_GRANT_TYPE = 'urn:openid:params:grant-type:ciba'

/** The person is named only by their own token, so a client can only reach people it is serving. */
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
    if (request.contextHash) {
      body.set('context_hash', request.contextHash)
    }

    const { status, json } = await this.post('/connect/ciba', body)

    if (status === 200) {
      if (
        typeof json['auth_req_id'] !== 'string' ||
        !json['auth_req_id'] ||
        !(Number(json['expires_in']) > 0)
      ) {
        throw new ServiceUnavailableException(
          'The identity server started an authentication without an id or a lifetime.',
        )
      }
      return {
        authReqId: json['auth_req_id'],
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

    if (json['error'] === 'access_denied') {
      const description = String(json['error_description'] ?? '')
      if (description.startsWith(SESSION_CANNOT_STEP_UP)) {
        throw new SessionCannotStepUpError()
      }
      if (description.startsWith(STEP_UP_UNAVAILABLE)) {
        throw new StepUpUnavailableError()
      }
    }

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
      let claims: StepUpClaims
      try {
        claims = await this.verifyAccessToken(json['access_token'])
      } catch (error) {
        throw new StepUpTokenRejectedError(
          error instanceof Error ? error.message : String(error),
        )
      }
      return { status: 'authenticated', claims }
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
      contextHash:
        typeof payload['step_up_context_hash'] === 'string'
          ? payload['step_up_context_hash']
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
    let text: string
    try {
      response = await fetch(`${this.options.issuer}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: AbortSignal.timeout(
          this.options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
        ),
      })
      text = await response.text()
    } catch {
      throw new ServiceUnavailableException(
        'The identity server could not be reached.',
      )
    }

    let json: Record<string, unknown> = {}
    try {
      const parsed: unknown = text ? JSON.parse(text) : {}
      if (parsed && typeof parsed === 'object') {
        json = parsed as Record<string, unknown>
      }
    } catch {
      if (response.ok) {
        throw new ServiceUnavailableException(
          'The identity server sent an answer that could not be read.',
        )
      }
    }

    return { status: response.status, json }
  }
}

const stripBearer = (authorization: string) =>
  authorization.replace(/^Bearer\s+/i, '')
