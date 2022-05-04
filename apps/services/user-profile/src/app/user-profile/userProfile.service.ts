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
import MagicBellClient, { Notification } from '@magicbell/core'
import * as OneSignal from 'onesignal-node'

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

  async getDeviceTokens(nationalId: string) {
    return await this.userDeviceTokensModel.findAll({
      where: { nationalId },
      order: [['created', 'DESC']],
    })
  }

  async addDeviceToken(body: DeviceTokenDto, user: User) {
    try {
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

  async notifyViaMagicBell(nationalId:string) {
    MagicBellClient.configure({
      apiKey: process.env.MAGICBELL_API_KEY ?? '',
      apiSecret: process.env.MAGICBELL_API_SECRET ?? '',
    })
    const notification = await Notification.create({
      title: 'New reply: I want to book a demo',
      content: 'Hi, I would like to book it on Monday, please',
      recipients: [{ email: nationalId }],
    })
    return { id: notification.id } // TODO change id parameter
  }

  async notifyViaOneSignal(nationalId:string) {
    const client = new OneSignal.Client(
      process.env.ONESIGNAL_APP_ID ?? '',
      process.env.ONESIGNAL_API_KEY ?? '',
    )

    const notification = await client
      .createNotification({
        contents: {
          tr: 'Yeni bildirim',
          en: 'New notification',
        },
        included_segments: ['Subscribed Users'],
      })
      .then((res) => res.body)

    return { id: notification.id } // TODO change id parameter
  }
}
