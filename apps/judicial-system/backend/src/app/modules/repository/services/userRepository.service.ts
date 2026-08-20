import { Op } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { InstitutionType, UserRole } from '@island.is/judicial-system/types'

import { Institution } from '../models/institution.model'
import { User } from '../models/user.model'

// Declared here rather than imported from the user module: the repository must not
// depend on a consumer's DTOs. The user module's CreateUserDto is structurally
// assignable to this type.
export type CreateUser = {
  nationalId: string
  name: string
  title: string
  mobileNumber: string
  email: string
  role: UserRole
  institutionId: string
  active: boolean
  canConfirmIndictment: boolean
  canManageMessageSuspension?: boolean
}

export type UpdateUser = {
  name?: string
  title?: string
  mobileNumber?: string
  email?: string
  active?: boolean
  canConfirmIndictment?: boolean
  canManageMessageSuspension?: boolean
}

// The institution is always loaded with a user: it is a repository detail, never the
// caller's choice.
const includeInstitution = [{ model: Institution, as: 'institution' }]

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(userId: string): Promise<User | null> {
    try {
      this.logger.debug(`Finding user ${userId}`)

      return await this.userModel.findByPk(userId, {
        include: includeInstitution,
      })
    } catch (error) {
      this.logger.error(`Error finding user ${userId}:`, { error })

      throw error
    }
  }

  async findActiveByNationalId(nationalId: string): Promise<User[]> {
    try {
      this.logger.debug('Finding all active users by national id')

      return await this.userModel.findAll({
        where: { nationalId, active: true },
        include: includeInstitution,
      })
    } catch (error) {
      this.logger.error('Error finding all active users by national id:', {
        error,
      })

      throw error
    }
  }

  async findAllActive(): Promise<User[]> {
    try {
      this.logger.debug('Finding all active users')

      return await this.userModel.findAll({
        order: ['name'],
        where: { active: true },
        include: includeInstitution,
      })
    } catch (error) {
      this.logger.error('Error finding all active users:', { error })

      throw error
    }
  }

  async findAllForAdmin(
    excludedRole: UserRole,
    institutionTypes: InstitutionType[],
  ): Promise<User[]> {
    try {
      this.logger.debug(
        `Finding all users, excluding the ${excludedRole} role, in ${institutionTypes.length} institution type(s)`,
      )

      return await this.userModel.findAll({
        order: ['name'],
        where: {
          role: { [Op.not]: excludedRole },
          // A nested column filter on the included institution
          '$institution.type$': institutionTypes,
        },
        include: includeInstitution,
      })
    } catch (error) {
      this.logger.error(
        `Error finding all users, excluding the ${excludedRole} role, in ${institutionTypes.length} institution type(s):`,
        { error },
      )

      throw error
    }
  }

  async findAllActiveWhoCanConfirmIndictments(
    institutionId: string,
  ): Promise<User[]> {
    try {
      this.logger.debug(
        `Finding all active users who can confirm indictments in institution ${institutionId}`,
      )

      return await this.userModel.findAll({
        where: { active: true, canConfirmIndictment: true, institutionId },
      })
    } catch (error) {
      this.logger.error(
        `Error finding all active users who can confirm indictments in institution ${institutionId}:`,
        { error },
      )

      throw error
    }
  }

  async findAllActiveProsecutors(institutionId: string): Promise<User[]> {
    try {
      this.logger.debug(
        `Finding all active prosecutors in institution ${institutionId}`,
      )

      return await this.userModel.findAll({
        where: {
          active: true,
          role: UserRole.PROSECUTOR,
          institutionId,
        },
      })
    } catch (error) {
      this.logger.error(
        `Error finding all active prosecutors in institution ${institutionId}:`,
        { error },
      )

      throw error
    }
  }

  async create(userToCreate: CreateUser): Promise<User> {
    try {
      this.logger.debug('Creating a user')

      return await this.userModel.create({ ...userToCreate })
    } catch (error) {
      this.logger.error('Error creating a user:', { error })

      throw error
    }
  }

  async updateById(
    userId: string,
    update: UpdateUser,
  ): Promise<{ numberOfAffectedRows: number; users: User[] }> {
    try {
      this.logger.debug(`Updating user ${userId}`)

      const [numberOfAffectedRows, users] = await this.userModel.update(
        update,
        {
          where: { id: userId },
          returning: true,
        },
      )

      return { numberOfAffectedRows, users }
    } catch (error) {
      this.logger.error(`Error updating user ${userId}:`, { error })

      throw error
    }
  }
}
