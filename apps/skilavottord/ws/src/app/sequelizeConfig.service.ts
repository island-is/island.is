import { Injectable } from '@nestjs/common'
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize'
import * as databaseConfig from '../../sequelize.config.js'

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  //constructor(/*@Inject(LOGGER_PROVIDER) private logger: Logger,*/) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    let config
    switch (process.env.NODE_ENV) {
      case 'test':
        config = databaseConfig.test
        break
      case 'production':
        config = databaseConfig.production
        break
      default:
        config = databaseConfig.development
    }

    return {
      ...config,
      define: {
        underscored: true,
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
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
      autoLoadModels: !process.env.INIT_SCHEMA,
      synchronize: false,
    }
  }
}
