import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApiUserModel } from './user.model'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(ApiUserModel)
    private readonly apiUserModel: typeof ApiUserModel,
  ) {}

  async findByApiKey(apiKey: string): Promise<ApiUserModel> {
    return await this.apiUserModel.findOne({
      where: {
        apiKey,
      },
    })
  }
}
