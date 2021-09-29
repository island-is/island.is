import { Inject, Injectable } from '@nestjs/common'
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize'

import * as databaseConfig from './../../../sequelize.config.js'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SequalizeConfig, SEQUELIZE_CONFIG } from './sequalize-config.module'

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(SEQUELIZE_CONFIG)
    private config: SequalizeConfig,
  ) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    // let config
    // switch (process.env.NODE_ENV) {
    //   case 'test':
    //     config = databaseConfig.test
    //     break
    //   case 'production':
    //     config = databaseConfig.production
    //     break
    //   default:
    //     config = databaseConfig.development
    // }

    return {
      ...this.config,
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
