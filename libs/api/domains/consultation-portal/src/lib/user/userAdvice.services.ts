import {
  ApiUserAdvicesGetRequest,
  UserApi,
} from '@island.is/clients/consultation-portal'
import { Injectable } from '@nestjs/common'
import { GetUserAdvicesInput } from '../dto/userAdvices.input'
import { UserAdviceAggregate } from '../models/userAdviceAggregate.model'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class UserAdviceResultService {
  constructor(private userApi: UserApi) {}

  private userApiWithAuth(auth: User) {
    return this.userApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getAllUserAdvices(
    auth: User,
    input: GetUserAdvicesInput,
  ): Promise<UserAdviceAggregate> {
    const request: ApiUserAdvicesGetRequest = {
      searchQuery: input.searchQuery,
      oldestFirst: input.oldestFirst,
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
    }

    const advicesResponse = await this.userApiWithAuth(auth).apiUserAdvicesGet(
      request,
    )

    return advicesResponse
  }
}
