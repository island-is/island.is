import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

import { environment } from '../../../environments'
import { HttpRequest } from '../../app.types'

const { airlineApiKeys } = environment

const AUTH_TYPE = 'bearer'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<HttpRequest>()
    return this.hasValidApiKey(request)
  }

  getAuthorization(headers: HttpRequest['headers']): string | null {
    const { authorization } = headers
    if (!authorization) {
      return null
    }

    if (typeof authorization === 'string') {
      return authorization
    }
    return authorization[0]
  }

  hasValidApiKey(request: HttpRequest): boolean {
    const authorization = this.getAuthorization(request.headers)
    if (!authorization) {
      return false
    }

    if (!authorization.toLowerCase().startsWith(AUTH_TYPE)) {
      return false
    }

    const apiKey = authorization.slice(AUTH_TYPE.length + 1)
    const airline = Object.keys(airlineApiKeys).find(
      (airline: string) => airlineApiKeys[airline] === apiKey,
    )
    if (!airline) {
      return false
    }

    request.airline = airline
    return true
  }
}
