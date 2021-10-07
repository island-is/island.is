import { Inject, Injectable } from '@nestjs/common'
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize'

import * as databaseConfig from './../../../sequelize.config.js'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    let config
    switch (process.env.NODE_ENV) {
      case 'development':
        config = databaseConfig.development
        break
      case 'production':
        config = databaseConfig.production
        break
      default:
        throw new Error('No database configuration found')
    }

    return {
      ...config,
      define: {
        underscored: true,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'modified',
      },
      dialectOptions: {
        useUTC: true,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: (message) => this.logger.debug(message),
      autoLoadModels: true,
      synchronize: false,
    } as SequelizeModuleOptions
  }
}
