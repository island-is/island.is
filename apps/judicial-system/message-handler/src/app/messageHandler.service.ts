import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import type { Message } from '@island.is/judicial-system/message'
import {
  messageEndpoint,
  MessageService,
} from '@island.is/judicial-system/message'

import { appModuleConfig } from './app.config'
import { InternalDeliveryService } from './internalDelivery.service'

@Injectable()
export class MessageHandlerService implements OnModuleDestroy {
  private running!: boolean
  private runner!: Promise<void>

  constructor(
    private readonly messageService: MessageService,
    private readonly internalDeliveryService: InternalDeliveryService,
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async handleMessage(message: Message): Promise<boolean> {
    this.logger.debug('Handling message', { msg: message })

    const handled = await this.internalDeliveryService.deliver(
      `${this.config.backendUrl}/api/internal${
        message.caseId ? `/case/${message.caseId}` : ''
      }/${messageEndpoint[message.type]}${
        message.elementId
          ? `/${
              Array.isArray(message.elementId)
                ? message.elementId.join('/')
                : message.elementId
            }`
          : ''
      }`,
      message.user,
      message.body,
    )

    this.logger.debug(`Message ${handled ? 'handled' : 'not handled'}`, {
      msg: message,
    })

    return handled
  }

  private async receiveMessages(resolve: () => void): Promise<void> {
    this.logger.info('Message handler started')

    this.running = true

    while (this.running) {
      this.logger.debug('Checking for messages')

      await this.messageService
        .receiveMessagesFromQueue(async (message: Message) => {
          return await this.handleMessage(message)
        })
        .catch(async (error) => {
          this.logger.error('Error handling message', { error })

          // Wait a bit before trying again
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.waitTimeSeconds * 1000),
          )
        })
    }

    this.logger.info('Message handler stopped')

    resolve()
  }

  async run(): Promise<void> {
    this.runner = new Promise<void>((resolve) => {
      this.receiveMessages(resolve)
    })
  }

  async onModuleDestroy() {
    this.running = false

    if (this.runner) {
      await this.runner
    }
  }
}
