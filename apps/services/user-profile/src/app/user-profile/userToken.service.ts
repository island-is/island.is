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
        // Same device, different user: reassign to current user
        this.logger.info('Device token reassigned to different user')

        await tokenWithDifferentUser.update({
          nationalId: user.nationalId,
        })

        return tokenWithDifferentUser
      }

      // Check if this user already has device token(s)
      const userTokens = await this.userDeviceTokensModel.findAll({
        where: { nationalId: user.nationalId },
        order: [['modified', 'DESC']],
      })

      if (userTokens.length > 0) {
        const [mostRecent, ...stale] = userTokens

        // Clean up any legacy extra tokens (we enforce one token per user)
        if (stale.length > 0) {
          this.logger.info('Cleaning up stale device tokens for user', {
            count: stale.length,
          })
          await this.userDeviceTokensModel.destroy({
            where: { id: stale.map((t) => t.id) },
          })
        }

        this.logger.info('User device token updated')

        await mostRecent.update({ deviceToken })

        return mostRecent
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
