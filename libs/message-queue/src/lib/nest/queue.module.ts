import { SQSClientConfig } from '@aws-sdk/client-sqs'
import { DynamicModule, Module } from '@nestjs/common'
import { LOGGER_PROVIDER, LoggingModule } from '@island.is/logging'
import { QueueService } from './queue.service'
import { WorkerService } from './worker.service'
import { CLIENT_CONFIG } from './constants'
import { Queue } from './types'
import {
  getQueueConfigToken,
  getQueueProviderToken,
  getWorkerToken,
} from './utils'

@Module({
  providers: [QueueService, WorkerService],
  exports: [QueueService],
})
export class QueueModule {
  static register(config: SQSClientConfig): DynamicModule {
    const providers = [
      {
        provide: CLIENT_CONFIG,
        useValue: config,
      },
    ]

    return {
      module: QueueModule,
      providers,
      exports: providers,
    }
  }

  static registerQueue(config: Queue): DynamicModule {
    const providers = [
      {
        provide: getQueueConfigToken(config.name),
        useValue: config,
      },
      {
        provide: getQueueProviderToken(config.name),
        useClass: QueueService,
        inject: [
          CLIENT_CONFIG,
          getQueueConfigToken(config.name),
          LOGGER_PROVIDER,
        ],
      },
      {
        provide: getWorkerToken(config.name),
        useClass: WorkerService,
        inject: [
          CLIENT_CONFIG,
          getQueueConfigToken(config.name),
          LOGGER_PROVIDER,
        ],
      },
    ]

    return {
      module: QueueModule,
      imports: [LoggingModule],
      providers,
      exports: providers,
    }
  }
}
