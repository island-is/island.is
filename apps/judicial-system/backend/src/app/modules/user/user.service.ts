import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

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

  getAll(): Promise<User[]> {
    this.logger.debug('Getting all users')

    return this.userModel.findAll({
      order: ['name'],
      where: {
        active: true,
      },
    })
  }

  findByNationalId(nationalId: string): Promise<User> {
    this.logger.debug(`Getting user with national id ${nationalId}`)

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
