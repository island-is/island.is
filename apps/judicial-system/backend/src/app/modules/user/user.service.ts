import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { UserRole } from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { Institution } from '../institution'
import { CreateUserDto } from './dto/createUser.dto'
import { UpdateUserDto } from './dto/updateUser.dto'
import { userModuleConfig } from './user.config'
import { User } from './user.model'

@Injectable()
export class UserService {
  constructor(
    @Inject(userModuleConfig.KEY)
    private readonly config: ConfigType<typeof userModuleConfig>,
    @InjectModel(User) private readonly userModel: typeof User,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  getAll(user: User): Promise<User[]> {
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

  getById(userId: string): Promise<User | null> {
    return this.userModel.findByPk(userId, {
      include: [{ model: Institution, as: 'institution' }],
    })
  }

  async findById(userId: string): Promise<User> {
    const user = await this.getById(userId)

    if (!user) {
      throw new NotFoundException(`User ${userId} does not exist`)
    }

    return user
  }

  async findByNationalId(nationalId: string): Promise<User> {
    // First check if the user is an admin
    try {
      const admin = this.config.adminUsers.find(
        (user: { nationalId: string }) => user.nationalId === nationalId,
      )

      if (admin) {
        // Default values are necessary because most of the fields are required
        // all the way up to the client. Consider refactoring this.
        return {
          created: nowFactory(),
          modified: nowFactory(),
          mobileNumber: '',
          email: '',
          role: UserRole.ADMIN,
          active: true,
          ...admin,
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

  create(userToCreate: CreateUserDto): Promise<User> {
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
