import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { User } from './user.model'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  findByNationalId(nationalId: string): Promise<User> {
    this.logger.debug(`Getting user with national id ${nationalId}`)

    return this.userModel.findOne({
      where: { nationalId },
    })
  }
}
