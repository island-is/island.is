import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { logger } from '@island.is/logging'
import { InjectWorker, WorkerService } from '@island.is/message-queue'

import { Message } from '@island.is/judicial-system/types'

import { appModuleConfig } from './app.config'

@Injectable()
export class AppService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @InjectWorker(appModuleConfig().sqsQueueName) private worker: WorkerService,
  ) {}

  async run() {
    logger.info('Initiating message handler')

    await this.worker.run(async (message: Message) => {
      logger.info('Handling message', message)
    })
  }
}
