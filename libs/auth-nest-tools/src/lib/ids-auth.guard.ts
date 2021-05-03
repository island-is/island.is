import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { getRequest } from './getRequest'

@Injectable()
export class IdsAuthGuard extends AuthGuard('jwt') {
  getRequest = getRequest

  getAuthenticateOptions() {
    return {
      property: 'auth',
    }
  }
}
