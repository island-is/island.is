import { Auth } from '@island.is/auth-nest-tools'

interface NewRequestInit extends RequestInit {
  auth?: Auth
  timeout?: number
}

interface NewRequest extends Request {
  auth?: Auth
  timeout?: number
}

type NewRequestInfo = NewRequest | string

type FetchAPI = (
  input: NewRequestInfo,
  init?: NewRequestInit,
) => Promise<Response>

export {
  NewRequest as Request,
  NewRequestInfo as RequestInfo,
  NewRequestInit as RequestInit,
  FetchAPI,
}
