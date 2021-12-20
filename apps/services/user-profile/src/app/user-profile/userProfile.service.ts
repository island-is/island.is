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

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile)
    private userProfileModel: typeof UserProfile,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @InjectModel(UserDeviceTokens)
    private readonly UserDeviceTokensModel: typeof UserDeviceTokens,
  ) {}

  async findById(id: string): Promise<UserProfile | null> {
    this.logger.debug(`Finding user profile by id "${id}"`)
    return this.userProfileModel.findOne({
      where: { id },
    })
  }

  async create(userProfileDto: CreateUserProfileDto): Promise<UserProfile> {
    return await this.userProfileModel.create(userProfileDto)
  }

  async findByNationalId(nationalId: string): Promise<UserProfile | null> {
    this.logger.debug(`Finding user profile by nationalId "${nationalId}"`)
    return this.userProfileModel.findOne({
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

    const [
      numberOfAffectedRows,
      [updatedUserProfile],
    ] = await this.userProfileModel.update(userProfileToUpdate, {
      where: { nationalId },
      returning: true,
    })

    return { numberOfAffectedRows, updatedUserProfile }
  }

  // FIND ALL TOKENS by NationalId - used by notifications workers
  async getDeviceTokens(nationalId: string) {
    return await this.UserDeviceTokensModel.findAll({
      where: { nationalId },
      order: [['created', 'DESC']],
    })
  }

  // CREATE TOKEN
  async addDeviceToken(body: DeviceTokenDto) {
    try {
      return await this.UserDeviceTokensModel.create(body)
    } catch (e) {
      throw new BadRequestException(e.errors)
    }
  }

  // DELETE TOKEN
  async deleteDeviceToken(body: DeviceTokenDto, user: User) {
    const token = await this.UserDeviceTokensModel.findOne({
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
