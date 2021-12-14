import { Injectable, Inject } from '@nestjs/common'
import { InjectWorker, WorkerService } from '@island.is/message-queue'
import { Message } from './dto/createNotification.dto'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class NotificationsWorkerService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @InjectWorker('notifications')
    private worker: WorkerService,
  ) {}

  async run() {
    await this.worker.run(
      async (message: Message): Promise<void> => {
        this.logger.info('Got message', message)
      },
    )
  }
}
