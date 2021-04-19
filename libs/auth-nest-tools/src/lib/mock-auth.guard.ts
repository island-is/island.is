import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { getRequest } from './getRequest'
import { Auth } from './auth'

@Injectable()
export class MockAuthGuard implements CanActivate {
  auth: Auth

  constructor(user: Partial<Auth>) {
    this.auth = {
      nationalId: '1234567890',
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
      request.auth = this.auth
    }
    return true
  }
}
