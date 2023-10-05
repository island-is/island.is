import type { AuthDelegationType } from '@island.is/shared/types'
import type { ExpressJwtOptions } from 'jwks-rsa'

export interface AuthConfig {
  audience: string | string[]
  issuer: string | string[]
  allowClientNationalId?: boolean
}

type FetchAPI = WindowOrWorkerGlobalScope['fetch']

interface FetchParams {
  url: string
  init: RequestInit
}

export interface RequestContext {
  fetch: FetchAPI
  url: string
  init: RequestInit
}

export interface Middleware {
  pre?(context: RequestContext): Promise<FetchParams | void>
}

export interface AuthMiddlewareOptions {
  forwardUserInfo: boolean
  tokenExchangeOptions?: TokenExchangeOptions
}

export interface TokenExchangeOptions {
  issuer: string
  clientId: string
  clientSecret: string
  scope: string
  requestActorToken?: boolean
}

export interface JwtAct {
  client_id: string
  act?: JwtAct
}

export interface JwtPayload {
  sub?: string
  nationalId?: string
  scope: string | string[]
  client_id: string
  act?: JwtAct
  client_nationalId?: string
  delegationType?: AuthDelegationType[]
  actor?: {
    nationalId: string
    scope?: string | string[]
  }
}

export interface Auth {
  sub?: string
  nationalId?: string
  scope: string[]
  authorization: string
  client: string
  delegationType?: AuthDelegationType[]
  actor?: {
    nationalId: string
    scope: string[]
  }
  act?: JwtAct
  ip?: string
  userAgent?: string
}

export interface MultiIssuerOptions extends Omit<ExpressJwtOptions, 'jwksUri'> {
  // Array of issuer URLs
  issuers: string[]
}

export interface User extends Auth {
  nationalId: string
}
