import { BadRequestException, Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UserDeviceTokens } from './models/userDeviceTokens.model'
import { User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Logger } from 'winston'

@Injectable()
export class UserTokenService {
  constructor(
    @InjectModel(UserDeviceTokens)
    private readonly userDeviceTokensModel: typeof UserDeviceTokens,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
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
      // Check if this exact device token already exists for this user
      const existingToken = await this.userDeviceTokensModel.findOne({
        where: { nationalId: user.nationalId, deviceToken },
      })

      if (existingToken) {
        return existingToken
      }

      // Check if this device token is already associated with a different user
      const tokenWithDifferentUser = await this.userDeviceTokensModel.findOne({
        where: { deviceToken },
      })

      if (tokenWithDifferentUser) {
        // Same device, different user: update the national_id
        this.logger.info('Device token reassigned to different user')

        await tokenWithDifferentUser.update({
          nationalId: user.nationalId,
        })

        return tokenWithDifferentUser
      }

      // Check if this user already has a different device token
      const userWithDifferentToken = await this.userDeviceTokensModel.findOne({
        where: { nationalId: user.nationalId },
      })

      if (userWithDifferentToken) {
        // Same user, different device: update the device_token
        this.logger.info('User device token updated')

        await userWithDifferentToken.update({
          deviceToken,
        })

        return userWithDifferentToken
      }

      // Neither exists: create new device token
      return await this.userDeviceTokensModel.create({
        deviceToken,
        nationalId: user.nationalId,
      })
    } catch (e) {
      throw new BadRequestException(e.errors)
    }
  }
}
