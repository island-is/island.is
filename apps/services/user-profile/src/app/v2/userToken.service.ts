import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UserDeviceTokens } from '../user-profile/userDeviceTokens.model'

@Injectable()
export class UserTokenService {
  constructor(
    @InjectModel(UserDeviceTokens)
    private readonly userDeviceTokensModel: typeof UserDeviceTokens,
  ) {}

  async findAllUserTokensByNationalId(
    nationalId: string,
  ): Promise<UserDeviceTokens[]> {
    return this.userDeviceTokensModel.findAll({
      where: { nationalId },
      order: [['created', 'DESC']],
    })
  }
}
