import { AuthMiddleware } from '../auth-tools/auth.middleware'
import {
  ApiUserAdvicesGetRequest,
  UserApi,
} from '@island.is/clients/consultation-portal'
import { Injectable } from '@nestjs/common'
import { GetUserAdvicesInput } from '../dto/userAdvices.input'
import { UserAdviceAggregate } from '../models/userAdviceAggregate.model'

@Injectable()
export class UserAdviceResultService {
  constructor(private userApi: UserApi) {}

  private getAllUserAdvicesWithAuth(authString: string) {
    return this.userApi.withMiddleware(new AuthMiddleware(authString))
  }

  async getAllUserAdvices(
    authString: string,
    input: GetUserAdvicesInput,
  ): Promise<UserAdviceAggregate> {
    const request: ApiUserAdvicesGetRequest = {
      searchQuery: input.searchQuery,
      oldestFirst: input.oldestFirst,
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
    }

    const advicesResponse = await this.getAllUserAdvicesWithAuth(
      authString,
    ).apiUserAdvicesGet(request)

    return advicesResponse
  }
}
