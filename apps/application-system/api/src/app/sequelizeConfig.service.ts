import { Inject, Injectable } from '@nestjs/common'
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { getOptions, dbConfigSchema } from '@island.is/nest/sequelize'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as dbConfig from '../../sequelize.config.js'

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    const env = process.env.NODE_ENV || 'development'
    const config = dbConfigSchema[env].parse(dbConfig)
    return {
      ...getOptions({
        config: config,
        logger: this.logger,
        recycleConnections: true,
      }),
    }
  }
}
