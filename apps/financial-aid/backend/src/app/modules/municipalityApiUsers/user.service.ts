import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApiUserModel } from './user.model'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(ApiUserModel)
    private readonly apiUserModel: typeof ApiUserModel,
  ) {}

  async findById(id: string): Promise<ApiUserModel> {
    console.log('LION KING')
    return await this.apiUserModel.findOne({
      where: {
        id,
      },
    })
  }
}
