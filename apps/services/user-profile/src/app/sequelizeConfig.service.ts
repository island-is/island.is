import { Inject, Injectable } from '@nestjs/common'
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as databaseConfig from '../../sequelize.config.js'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  getSequelizeConfig() {
    switch (process.env.NODE_ENV) {
      case 'test':
        return databaseConfig.test
      case 'production':
        return databaseConfig.production
      default:
        return databaseConfig.development
    }
  }

  createSequelizeOptions(): SequelizeModuleOptions {
    const config = this.getSequelizeConfig() as SequelizeModuleOptions
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
    }
  }
}
