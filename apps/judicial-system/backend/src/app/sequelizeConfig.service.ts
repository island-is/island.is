import { Inject, Injectable } from '@nestjs/common'
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { getOptions } from '@island.is/nest/sequelize'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as dbConfig from '../../sequelize.config.js'
import { createRequestTransactionQueryHook } from './middleware'

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    const env = process.env.NODE_ENV || 'development'
    const config = (dbConfig as { [key: string]: object })[env]
    return {
      ...config,
      ...getOptions({ logger: this.logger }),
      hooks: {
        // A query without the request's transaction, while that transaction
        // holds a row lock, can wedge the connection pool - see the hook. It
        // fails the request where NODE_ENV is not production, which is a
        // locally started backend and nothing deployed: dev and staging run
        // the production image too. Everywhere else the query is reported and
        // allowed to run, since failing a request that would most often have
        // succeeded is the worse outcome where users are.
        beforeQuery: createRequestTransactionQueryHook({
          logger: this.logger,
          strict: env !== 'production',
        }),
      },
    }
  }
}
