import { Injectable } from '@nestjs/common'
import { AuthMiddleware } from '../auth-tools/auth.middleware'

import { UserApi } from '@island.is/clients/consultation-portal'
import { UserEmailResult } from '../models/userEmailResult.model'

@Injectable()
export class UserEmailResultService {
  constructor(private userApi: UserApi) {}

  private getUserEmailWithAuth(authString: string) {
    return this.userApi.withMiddleware(new AuthMiddleware(authString))
  }

  async getUserEmail(authString: string): Promise<UserEmailResult> {
    const emailResponse = await this.getUserEmailWithAuth(
      authString,
    ).apiUserEmailGet()

    return emailResponse
  }
}
