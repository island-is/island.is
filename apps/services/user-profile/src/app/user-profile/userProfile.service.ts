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
import { DeviceTokenDto } from './dto/DeviceToken.dto'

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

  // User Notifications
  // FIND ALL by NationalId
  async getDeviceTokens(user: User) {
    try {
      return await this.UserDeviceTokensModel.findAll({
        where: { nationalId: user.nationalId },
        order: [['created', 'DESC']],
      })
    } catch (error) {
      throw new NotFoundException()
    }
  }

  // CREATE
  async addDeviceToken(body: DeviceTokenDto) {
    try {
      return await this.UserDeviceTokensModel.create(body)
    } catch (e) {
      throw new BadRequestException(e.errors)
    }
  }

  // // UPDATE
  // async updateDeviceToken(body: UpdateUserDeviceTokenDto, user: User) {
  //   try {
  //     const res = await this.UserDeviceTokensModel.findOne({
  //       where: { id: body.id, nationalId: user.nationalId },
  //     })
  //     if (res) {
  //       // res.isEnabled = body.isEnabled
  //       res.save()
  //       return res
  //     } else {
  //       throw new BadRequestException()
  //     }
  //   } catch (e) {
  //     throw new BadRequestException(e.errors)
  //   }
  // }

  // DELETE
  async deleteDeviceToken(body: DeviceTokenDto, user: User) {
    const res = await this.UserDeviceTokensModel.destroy({
      where: { nationalId: user.nationalId, deviceToken: body.deviceToken },
    })
    // return
  }
}
