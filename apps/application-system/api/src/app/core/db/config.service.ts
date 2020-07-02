import { Injectable } from '@nestjs/common'
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize'
// import { databaseConfig } from './db.config'
import databaseConfig from '../../../../sequelize.config.js'
import { DEVELOPMENT, PRODUCTION, TEST } from '../constants'
import { Application } from './models/application.model'

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  createSequelizeOptions(): SequelizeModuleOptions {
    let config
    switch (process.env.NODE_ENV) {
      case DEVELOPMENT:
        config = databaseConfig.development
        break
      case TEST:
        config = databaseConfig.test
        break
      case PRODUCTION:
        config = databaseConfig.production
        break
      default:
        config = databaseConfig.development
    }

    return {
      ...config,
      models: [Application],
    }
  }
}
