import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { UserRole } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { CreateUserDto, UpdateUserDto } from './dto'
import { User } from './user.model'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  getAll(user: User): Promise<User[]> {
    this.logger.debug('Getting all users')

    if (user.role === UserRole.ADMIN) {
      return this.userModel.findAll({
        order: ['name'],
      })
    }

    return this.userModel.findAll({
      order: ['name'],
      where: {
        active: true,
      },
    })
  }

  async findByNationalId(nationalId: string): Promise<User> {
    this.logger.debug(`Getting user with national id ${nationalId}`)

    // First check if the user is an admin
    try {
      const admin = (JSON.parse(environment.admin.users) as User[]).find(
        (user) => user.nationalId === nationalId,
      )

      if (admin) {
        return {
          ...admin,
          title: '',
          mobileNumber: '',
          email: '',
          role: UserRole.ADMIN,
          institution: '',
          active: true,
        } as User
      }
    } catch (error) {
      this.logger.error('Failed to parse admin users', error)
    }

    return this.userModel.findOne({
      where: { nationalId },
    })
  }

  create(userToCreate: CreateUserDto): Promise<User> {
    this.logger.debug(
      `Creating a new user with national id ${userToCreate.nationalId}`,
    )

    return this.userModel.create(userToCreate)
  }

  async update(
    id: string,
    update: UpdateUserDto,
  ): Promise<{ numberOfAffectedRows: number; updatedUser: User }> {
    this.logger.debug(`Updating user ${id}`)

    const [numberOfAffectedRows, [updatedUser]] = await this.userModel.update(
      update,
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedUser }
  }
}
