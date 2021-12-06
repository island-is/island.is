import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

import { environment } from '../../../environments'
import { Request } from 'express'

const { externalServiceProvidersApiKeys } = environment

const AUTH_TYPE = 'bearer'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    return this.hasValidApiKey(request)
  }

  getAuthorization(headers: Request['headers']): string | null {
    const { authorization } = headers
    if (!authorization) {
      return null
    }

    if (typeof authorization === 'string') {
      return authorization
    }
    return authorization[0]
  }

  hasValidApiKey(request: Request): boolean {
    const authorization = this.getAuthorization(request.headers)
    if (!authorization) {
      return false
    }

    if (!authorization.toLowerCase().startsWith(AUTH_TYPE)) {
      return false
    }

    const apiKey = authorization.slice(AUTH_TYPE.length + 1)
    if (!apiKey) {
      return false
    }

    const provider = Object.keys(externalServiceProvidersApiKeys).find(
      (provider: string) =>
        externalServiceProvidersApiKeys[provider] === apiKey,
    )
    if (!provider) {
      return false
    }
    return true
  }
}
