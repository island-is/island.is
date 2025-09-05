import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UserDeviceTokens } from './models/userDeviceTokens.model'
import { User } from '@island.is/auth-nest-tools'

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

  async deleteUserTokenByNationalId(
    nationalId: string,
    deviceToken: string,
  ): Promise<void> {
    await this.userDeviceTokensModel.destroy({
      where: {
        nationalId,
        deviceToken,
      },
    })
  }

  async addDeviceToken(deviceToken: string, user: User) {
    try {
      const token = await this.userDeviceTokensModel.findOne({
        where: { nationalId: user.nationalId, deviceToken },
      })

      if (token) {
        return token
      }

      return await this.userDeviceTokensModel.create({
        deviceToken,
        nationalId: user.nationalId,
      })
    } catch (e) {
      throw new BadRequestException(e.errors)
    }
  }
}
