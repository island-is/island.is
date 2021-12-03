import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateUserNotificationDto } from './dto/create-user-notification.dto'
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto'
import { UserNotifications } from './user-notifications.model'

@Injectable()
export class UserNotificationsService {
  constructor(
    @InjectModel(UserNotifications)
    private readonly UserNotificationsModel: typeof UserNotifications,
  ) {}

  // CREATE
  async create(createUserNotificationDto: CreateUserNotificationDto) {
    try {
      return await this.UserNotificationsModel.create(createUserNotificationDto)
    } catch (e) {
      throw new BadRequestException(e.errors);
    }
  }

  // FIND ALL
  async findAll() {
    const obj = {
      nationalId: '1305775399',
      device_token: new Date().toISOString(),
    }

    try {
      return await this.UserNotificationsModel.findAll({
        where: { nationalId: obj.nationalId },
      })
    } catch (error) {
      throw new NotFoundException();
    }
  }


  // UPDATE
  async update(id: string, updateUserNotificationDto: UpdateUserNotificationDto) {
    try{
      const res = await this.UserNotificationsModel.update(updateUserNotificationDto,{where:{id}})
      if(res.length > 0) {
        return this.UserNotificationsModel.findOne({where:{id}})
      }
    } catch(e){
      throw new BadRequestException(e.errors);
    }
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const res = await this.UserNotificationsModel.destroy({where:{id}})
    if(res != 1) {
      throw new NotFoundException();
    }
  }
}
