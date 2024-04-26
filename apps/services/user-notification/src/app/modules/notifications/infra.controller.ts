import { InfraController } from '@island.is/infra-nest-server'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import {
  Controller,
  Get,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
@Controller()
export class UserNotificationsInfraController extends InfraController {
  constructor(
    private sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    super()
  }

  @Get('/readiness')
  async readiness(): Promise<{ ok: boolean }> {
    try {
      await this.sequelize.authenticate()
      this.logger.info(
        'readiness: Connection to the database has been established successfully.',
      )
      return { ok: true }
    } catch (error) {
      this.logger.error('readiness: Unable to connect to the database:', error)
      throw new ServiceUnavailableException(
        'Service is temporarily unavailable.',
      )
    }
  }
}
