import { Op } from 'sequelize'

import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import {
  getAdminUserInstitutionScope,
  isAdminUser,
  User as TUser,
  UserRole,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { Institution, User } from '../repository'
import { CreateUserDto } from './dto/createUser.dto'
import { UpdateUserDto } from './dto/updateUser.dto'
import { userModuleConfig } from './user.config'

@Injectable()
export class UserService {
  constructor(
    @Inject(userModuleConfig.KEY)
    private readonly config: ConfigType<typeof userModuleConfig>,
    @InjectModel(User) private readonly userModel: typeof User,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAll(user: TUser): Promise<User[]> {
    if (isAdminUser(user)) {
      return this.userModel.findAll({
        order: ['name'],
        include: [{ model: Institution, as: 'institution' }],
        // Local admins can only see users from a select list of institutions
        // and they do not see local admins
        where: {
          role: { [Op.not]: user.role },
          '$institution.type$': getAdminUserInstitutionScope(user),
        },
      })
    }

    return this.userModel.findAll({
      order: ['name'],
      where: { active: true },
      include: [{ model: Institution, as: 'institution' }],
    })
  }

  async getById(userId: string): Promise<User | null> {
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

  async findByNationalId(nationalId: string): Promise<User[]> {
    // First check if the user is an admin
    try {
      const admin = this.config.adminUsers.find(
        (user: { nationalId: string }) => user.nationalId === nationalId,
      )

      if (admin) {
        // Default values are necessary because most of the fields are required
        // all the way up to the client. Consider refactoring this.
        return [
          {
            created: nowFactory(),
            modified: nowFactory(),
            mobileNumber: '',
            email: '',
            role: UserRole.ADMIN,
            active: true,
            canConfirmIndictment: false,
            ...admin,
          } as User,
        ]
      }
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error('Failed to parse admin users', { error })
    }

    const users = await this.userModel.findAll({
      where: { nationalId, active: true },
      include: [{ model: Institution, as: 'institution' }],
    })

    if (!users || users.length === 0) {
      throw new NotFoundException('User does not exist')
    }

    return users
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

  getUsersWhoCanConfirmIndictments(
    prosecutorsOfficeId: string,
  ): Promise<User[]> {
    return this.userModel.findAll({
      where: {
        active: true,
        canConfirmIndictment: true,
        institutionId: prosecutorsOfficeId,
      },
    })
  }
}
