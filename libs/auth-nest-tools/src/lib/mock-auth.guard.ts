import { CanActivate, Injectable } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'
import { getRequest } from './getRequest'
import type { Auth } from './auth'
import type { User } from './user'

@Injectable()
export class MockAuthGuard implements CanActivate {
  auth: Auth

  constructor(user: Partial<Auth>) {
    this.auth = {
      nationalId: '0101302989',
      authorization: '',
      client: 'mock',
      scope: [],
      ...user,
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = getRequest(context)
    request.auth = this.auth
    if (this.auth.nationalId) {
      request.user = this.auth as User
    }
    return true
  }
}
