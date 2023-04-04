import { Injectable } from '@nestjs/common'

import { UserApi } from '@island.is/clients/consultation-portal'
import { UserEmailResult } from '../models/userEmailResult.model'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class UserEmailResultService {
  constructor(private userApi: UserApi) {}

  private userApiWithAuth(auth: User) {
    return this.userApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getUserEmail(auth: User): Promise<UserEmailResult> {
    const emailResponse = await this.userApiWithAuth(auth).apiUserEmailGet()

    return emailResponse
  }
}
