import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateUserNotificationDto } from './dto/create-user-notification.dto'
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto'
import { UserNotifications } from './user-notifications.model'
import type { User } from '@island.is/auth-nest-tools'

@Injectable()
export class UserNotificationsService {
  constructor(
    @InjectModel(UserNotifications)
    private readonly UserNotificationsModel: typeof UserNotifications,
  ) {}

  // FIND ALL by NationalId
  async findAll(user: User) {
    try {
      return await this.UserNotificationsModel.findAll({
        where: { nationalId: user.nationalId },
        order: [['created', 'DESC']],
      })
    } catch (error) {
      throw new NotFoundException()
    }
  }

  // CREATE
  async create(body: CreateUserNotificationDto) {
    try {
      return await this.UserNotificationsModel.create(body)
    } catch (e) {
      throw new BadRequestException(e.errors)
    }
  }

  // UPDATE
  async update(id: string, body: UpdateUserNotificationDto, user: User) {
    try {
      const res = await this.UserNotificationsModel.findOne({
        where: { id, nationalId: user.nationalId },
      })
      if (res) {
        res.isEnabled = body.isEnabled
        res.save()
        return res
      } else {
        throw new BadRequestException()
      }
    } catch (e) {
      throw new BadRequestException(e.errors)
    }
  }

  // // DELETE ready for later
  // async remove(id: string): Promise<void> {
  //   const res = await this.UserNotificationsModel.destroy({where:{id}})
  //   if(res != 1) {
  //     throw new NotFoundException();
  //   }
  // }
}
