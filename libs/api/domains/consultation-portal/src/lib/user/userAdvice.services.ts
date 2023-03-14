import { UserApi } from '@island.is/clients/consultation-portal'
import { Injectable } from '@nestjs/common'
import { UserAdviceResult } from '../models/userAdviceResult.model'

@Injectable()
export class UserAdviceResultService {
  constructor(private userApi: UserApi) {}

  async getAllUserAdvices(): Promise<UserAdviceResult[]> {
    const advices = await this.userApi.apiUserAdvicesGet()
    return advices
  }
}
