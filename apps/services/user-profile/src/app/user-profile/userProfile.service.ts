import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateUserProfileDto } from './dto/createUserProfileDto'
import { UpdateUserProfileDto } from './dto/updateUserProfileDto'
import { UserProfile } from './userProfile.model'
import { User } from '@island.is/auth-nest-tools'
import { UserDeviceTokens } from './userDeviceTokens.model'
import { DeviceTokenDto } from './dto/deviceToken.dto'
import { Emails } from '../v2/models/emails.model'

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile)
    private userProfileModel: typeof UserProfile,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @InjectModel(UserDeviceTokens)
    private readonly userDeviceTokensModel: typeof UserDeviceTokens,
  ) {}

  async create(userProfileDto: CreateUserProfileDto): Promise<UserProfile> {
    return this.userProfileModel.create({ ...userProfileDto })
  }

  async findByNationalId(nationalId: string): Promise<UserProfile | null> {
    this.logger.debug(`Finding user profile by nationalId "${nationalId}"`)
    return this.userProfileModel.findOne({
      include: {
        model: Emails,
        as: 'emails',
        required: true,
        where: {
          primary: true,
        },
      },
      where: { nationalId },
    })
  }

  async update(
    nationalId: string,
    userProfileToUpdate: UpdateUserProfileDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedUserProfile: UserProfile
  }> {
    this.logger.debug(`Updating user profile with id "${nationalId}"`)

    const [numberOfAffectedRows, [updatedUserProfile]] =
      await this.userProfileModel.update(userProfileToUpdate, {
        where: { nationalId },
        returning: true,
      })

    return { numberOfAffectedRows, updatedUserProfile }
  }

  async getDeviceTokens(nationalId: string) {
    return await this.userDeviceTokensModel.findAll({
      where: { nationalId },
      order: [['created', 'DESC']],
    })
  }

  async addDeviceToken(body: DeviceTokenDto, user: User) {
    try {
      const token = await this.userDeviceTokensModel.findOne({
        where: { nationalId: user.nationalId, deviceToken: body.deviceToken },
      })

      if (token) {
        return token
      }

      return await this.userDeviceTokensModel.create({
        ...body,
        nationalId: user.nationalId,
      })
    } catch (e) {
      throw new BadRequestException(e.errors)
    }
  }

  async deleteDeviceToken(body: DeviceTokenDto, user: User) {
    const token = await this.userDeviceTokensModel.findOne({
      where: { nationalId: user.nationalId, deviceToken: body.deviceToken },
    })
    if (token) {
      const destroy = await token.destroy()
      return { success: Boolean(destroy) }
    } else {
      throw new NotFoundException()
    }
  }
}
