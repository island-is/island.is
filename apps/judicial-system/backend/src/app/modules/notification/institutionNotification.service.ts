import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { NotificationType } from '@island.is/judicial-system/types'

import { DeliverResponse } from './models/deliver.response'

@Injectable()
export class InstitutionNotificationService {
  constructor(
    private readonly intlService: IntlService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Útbúa sérstakann message module fyrir intlService

  private formatMessage: FormatMessage = () => {
    throw new InternalServerErrorException('Format message not initialized')
  }

  private async refreshFormatMessage(): Promise<void> {
    return this.intlService
      .useIntl(['judicial.system.backend'], 'is')
      .then((res) => {
        this.formatMessage = res.formatMessage
      })
      .catch((reason) => {
        this.logger.error('Unable to refresh format messages', { reason })
      })
  }

  private async sendIndictmentsWaitingForConfirmationNotification(
    prosecutorsOfficeId: string,
  ): Promise<void> {
    // This is a mock function that would send a notification to all prosecutors' offices
    // in the system. In a real system, this would be implemented to send a notification
    // to a specific prosecutors' office.
    return
  }

  async sendNotification(
    type: NotificationType,
    prosecutorsOfficeId: string,
  ): Promise<DeliverResponse> {
    try {
      switch (type) {
        case NotificationType.INDICTMENTS_WAITING_FOR_CONFIRMATION:
          await this.sendIndictmentsWaitingForConfirmationNotification(
            prosecutorsOfficeId,
          )
          break
        default:
          throw new InternalServerErrorException(
            `Invalid notification type ${type}`,
          )
      }
    } catch (error) {
      this.logger.error('Failed to send notification', error)

      return { delivered: false }
    }

    return { delivered: true }
  }
}
