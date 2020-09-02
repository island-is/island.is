import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

import { environment } from '../../../environments'

const { airlineApiKeys } = environment

const AUTH_TYPE = 'bearer'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    return this.hasValidApiKey(request)
  }

  hasValidApiKey(request): boolean {
    const { authorization } = request.headers
    if (!authorization || !authorization.toLowerCase().startsWith(AUTH_TYPE)) {
      return false
    }
    const apiKey = authorization.slice(AUTH_TYPE.length + 1)
    request.airline = Object.keys(airlineApiKeys).find(
      (airline) => airlineApiKeys[airline] === apiKey,
    )
    return Boolean(request.airline)
  }
}
