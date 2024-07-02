import { DynamicModule, Module } from '@nestjs/common'
import { Logger, LOGGER_PROVIDER, LoggingModule } from '@island.is/logging'
import { Config } from './types'
import { ClientService } from './client.service'
import { QueueService } from './queue.service'
import { WorkerService } from './worker.service'
import {
  getClientServiceToken,
  getQueueServiceToken,
  getWorkerServiceToken,
} from './utils'

@Module({})
export class QueueModule {
  static register(config: Config): DynamicModule {
    const clientToken = getClientServiceToken(config.queue.name)
    const queueToken = getQueueServiceToken(config.queue.name)
    const workerToken = getWorkerServiceToken(config.queue.name)

    const client = {
      provide: clientToken,
      useFactory: (logger: Logger) => {
        return new ClientService(config.client, logger)
      },
      inject: [LOGGER_PROVIDER],
    }

    const queue = {
      provide: queueToken,
      useFactory: (clientService: ClientService, _logger: Logger) => {
        return new QueueService(clientService, config.queue)
      },
      inject: [clientToken, LOGGER_PROVIDER],
    }

    const worker = {
      provide: workerToken,
      useFactory: (
        clientService: ClientService,
        queueService: QueueService,
        logger: Logger,
      ) => {
        return new WorkerService(
          config.queue,
          clientService,
          queueService,
          logger,
        )
      },
      inject: [clientToken, queueToken, LOGGER_PROVIDER],
    }

    return {
      module: QueueModule,
      imports: [LoggingModule],
      providers: [client, queue, worker],
      exports: [queue, worker],
    }
  }
}
