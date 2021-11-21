import { Inject, Injectable } from '@nestjs/common'
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize'
import addSeconds from 'date-fns/addSeconds'
import differenceInSeconds from 'date-fns/differenceInSeconds'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as databaseConfig from './../../../sequelize.config.js'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
const getRandomWithinRange = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const baseConnectionAgeInSeconds = 1 * 60 // 1 minute

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    let config
    switch (process.env.NODE_ENV) {
      case 'test':
        this.logger.error('Please use @island.is/testing for testing purposes')
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
        createdAt: 'created',
        updatedAt: 'modified',
      },
      dialectOptions: {
        useUTC: true,
      },
      pool: {
        max: parseInt(process.env.SEQUALIZE_POOL_MAX ?? '5'),
        min: 0,
        acquire: 30000,
        idle: 10000,
        validate: (obj: { recycleWhen?: Date }) => {
          // Recycle connections periodically
          if (!obj.recycleWhen) {
            // Setup expiry on new connections and return the connection as valid
            obj.recycleWhen = addSeconds(
              new Date(),
              getRandomWithinRange(
                baseConnectionAgeInSeconds,
                baseConnectionAgeInSeconds * 2,
              ),
            )
            return true
          }
          // Recycle the connection if it has expired
          return differenceInSeconds(new Date(), obj.recycleWhen) < 0
        },
      },
      logging: (message) => this.logger.debug(message),
      autoLoadModels: true,
      synchronize: false,
    } as SequelizeModuleOptions
  }
}
