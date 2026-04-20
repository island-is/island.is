import { Auth } from '@island.is/auth-nest-tools'

/**
 * DOM fetch compatible extensions.
 */
export interface EnhancedRequestInit extends RequestInit {
  auth?: Auth
  timeout?: number
}

export interface EnhancedRequest extends Request {
  auth?: Auth
  timeout?: number
}

export type EnhancedRequestInfo = EnhancedRequest | string | URL

export type EnhancedFetchAPI = (
  input: EnhancedRequestInfo,
  init?: EnhancedRequestInit,
) => Promise<Response>

export interface ApiResponse<T> {
  raw: Response
  value(): Promise<T>
}

export type AuthSource = 'context' | 'request'
