import { AuthMiddleware } from '../auth-tools/auth.middleware'
import { UserApi } from '@island.is/clients/consultation-portal'
import { Injectable } from '@nestjs/common'
import { UserAdviceResult } from '../models/userAdviceResult.model'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'

@Injectable()
export class UserAdviceResultService {
  constructor(private userApi: UserApi) {}

  private getAllUserAdvicesWithAuth(authString: string) {
    return this.userApi.withMiddleware(
      new AuthMiddleware(authString)
    )
  }

  async getAllUserAdvices(
    authString: string
  ): Promise<UserAdviceResult[]> {
    const advicesResponse = await this.getAllUserAdvicesWithAuth(
      authString
    ).apiUserAdvicesGet()
    
    return advicesResponse
  }
}
