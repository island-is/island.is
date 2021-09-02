import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { UserRole } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { Institution } from '../institution'
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

  async getAll(user: User): Promise<User[]> {
    this.logger.debug('Getting all users')

    if (user.role === UserRole.ADMIN) {
      return this.userModel.findAll({
        order: ['name'],
        include: [{ model: Institution, as: 'institution' }],
      })
    }

    return this.userModel.findAll({
      order: ['name'],
      where: {
        active: true,
      },
      include: [{ model: Institution, as: 'institution' }],
    })
  }

  async findById(id: string): Promise<User | null> {
    this.logger.debug(`Finding user ${id}`)

    return this.userModel.findOne({
      where: { id },
      include: [{ model: Institution, as: 'institution' }],
    })
  }

  async findByNationalId(nationalId: string): Promise<User | null> {
    this.logger.debug('Getting a user by national id')

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
      this.logger.error('Failed to parse admin users', error)
    }

    return this.userModel.findOne({
      where: { nationalId },
      include: [{ model: Institution, as: 'institution' }],
    })
  }

  async create(userToCreate: CreateUserDto): Promise<User> {
    this.logger.debug('Creating a new user')

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
