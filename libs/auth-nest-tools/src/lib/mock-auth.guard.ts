import { CanActivate, Injectable } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'
import { getRequest } from './getRequest'
import type { Auth } from './auth'
import type { User } from './user'

@Injectable()
export class MockAuthGuard implements CanActivate {
  auth: Auth

  constructor(auth: Partial<Auth>) {
    this.auth = {
      nationalId: '0101302989',
      authorization: '',
      client: 'mock',
      scope: [],
      ...auth,
    }
  }

  getAuth(): Auth {
    return this.auth
  }

  canActivate(context: ExecutionContext): boolean {
    const request = getRequest(context)
    request.auth = this.getAuth()
    if (request.auth.nationalId) {
      request.user = request.auth as User
    }
    return true
  }
}
