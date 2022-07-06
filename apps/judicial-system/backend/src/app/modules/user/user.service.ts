import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { UserRole } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { Institution } from '../institution'
import { CreateUserDto } from './dto/createUser.dto'
import { UpdateUserDto } from './dto/updateUser.dto'
import { User } from './user.model'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAll(user: User): Promise<User[]> {
    if (user.role === UserRole.ADMIN) {
      return this.userModel.findAll({
        order: ['name'],
        include: [{ model: Institution, as: 'institution' }],
      })
    }

    return this.userModel.findAll({
      order: ['name'],
      where: { active: true },
      include: [{ model: Institution, as: 'institution' }],
    })
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { id: userId },
      include: [{ model: Institution, as: 'institution' }],
    })

    if (!user) {
      throw new NotFoundException(`User ${userId} does not exist`)
    }

    return user
  }

  async findByNationalId(nationalId: string): Promise<User> {
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
          active: true,
        } as User
      }
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error('Failed to parse admin users', { error })
    }

    const user = await this.userModel.findOne({
      where: { nationalId },
      include: [{ model: Institution, as: 'institution' }],
    })

    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    return user
  }

  async create(userToCreate: CreateUserDto): Promise<User> {
    return this.userModel.create({ ...userToCreate })
  }

  async update(userId: string, update: UpdateUserDto): Promise<User> {
    const [numberOfAffectedRows] = await this.userModel.update(update, {
      where: { id: userId },
    })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating user ${userId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new NotFoundException(`Could not update user ${userId}`)
    }

    return this.findById(userId)
  }
}
