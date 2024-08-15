import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  InstitutionType,
  NotificationType,
} from '@island.is/judicial-system/types'

import { Institution, InstitutionService } from '../institution'
import { DeliverResponse } from './models/deliver.response'

@Injectable()
export class NotificationDispatchService {
  constructor(
    private readonly institutionService: InstitutionService,
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async dispatchIndictmentsWaitingForConfirmationNotification(): Promise<void> {
    const prosecutorsOffices = await this.institutionService.getAll(
      InstitutionType.PROSECUTORS_OFFICE,
    )

    const messages = prosecutorsOffices.map(
      (prosecutorsOffice: Institution) => ({
        type: MessageType.NOTIFICATION,
        body: {
          type: NotificationType.INDICTMENTS_WAITING_FOR_CONFIRMATION,
          prosecutorsOfficeId: prosecutorsOffice.id,
        },
      }),
    )

    return this.messageService.sendMessagesToQueue(messages)
  }

  async dispatchNotification(type: NotificationType): Promise<DeliverResponse> {
    try {
      switch (type) {
        case NotificationType.INDICTMENTS_WAITING_FOR_CONFIRMATION:
          await this.dispatchIndictmentsWaitingForConfirmationNotification()
          break
        default:
          throw new InternalServerErrorException(
            `Invalid notification type ${type}`,
          )
      }
    } catch (error) {
      this.logger.error('Failed to dispatch notification', error)

      return { delivered: false }
    }

    return { delivered: true }
  }
}
