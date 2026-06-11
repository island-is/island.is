import { Injectable, BadRequestException } from '@nestjs/common'
import { ApiClientCallback } from '@island.is/api/domains/payment'
import { PaymentMethod, PaymentService } from './payment.service'
import { ApplicationService } from '@island.is/application/api/core'
import addMonths from 'date-fns/addMonths'
import { addWorkDays, createDailyCompletionNotifications } from './utils'
import {
  NotificationConfig,
  NotificationType,
} from '@island.is/application/types'

@Injectable()
export class PaymentCallbackService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly applicationService: ApplicationService,
  ) {}

  async handleApiClientCallback(callback: ApiClientCallback): Promise<void> {
    if (callback.type === 'update') {
      if (!callback.paymentFlowMetadata) {
        throw new BadRequestException(
          'No paymentFlowMetadata found in update callback',
        )
      }
      if (!callback.paymentFlowMetadata.applicationId) {
        throw new BadRequestException(
          'No applicationId found in update callback',
        )
      }
      if (
        callback.details?.reason === 'payment_started' &&
        callback.details?.message === 'Invoice created'
      ) {
        const application = await this.applicationService.findOneById(
          callback.paymentFlowMetadata.applicationId,
        )
        if (application) {
          const twoWorkingDaysFromNow = addWorkDays(new Date(), 2)
          const applicationLink = await this.paymentService.getApplicationUrl(
            application.id,
          )
          await this.applicationService.update(
            callback.paymentFlowMetadata.applicationId,
            {
              ...application,
              pruneAt: twoWorkingDaysFromNow,
            },
          )
          await this.paymentService.setPaymentMethod(
            callback.paymentFlowMetadata.applicationId,
            PaymentMethod.INVOICE,
          )
          await this.applicationService.createScheduledNotifications(
            application.id,
            application.state,
            [
              {
                template:
                  NotificationConfig[NotificationType.PaymentReminder]
                    .templateId,
                schedule_time: addWorkDays(new Date(), 1),
                args: [
                  {
                    key: 'expiryDate',
                    value: twoWorkingDaysFromNow.toLocaleDateString('is-IS'),
                  },
                  {
                    key: 'expiryTime',
                    value: twoWorkingDaysFromNow.toLocaleTimeString('is-IS', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  },
                  {
                    key: 'applicationLink',
                    value: applicationLink,
                  },
                ],
              },
            ],
          )
        }
      }
      return
    }

    if (callback.type === 'success') {
      if (!callback.paymentFlowMetadata) {
        throw new BadRequestException(
          'No paymentFlowMetadata found in success callback',
        )
      }
      if (!callback.paymentFlowMetadata.paymentId) {
        throw new BadRequestException('No paymentId found in success callback')
      }
      if (!callback.paymentFlowMetadata.applicationId) {
        throw new BadRequestException(
          'No applicationId found in success callback',
        )
      }
      await this.paymentService.fulfillPayment(
        callback.paymentFlowMetadata.paymentId,
        callback.paymentFlowMetadata.applicationId,
      )

      const application = await this.applicationService.findOneById(
        callback.paymentFlowMetadata.applicationId,
      )
      if (application) {
        const oneMonthFromNow = addMonths(new Date(), 1)
        //Applications payment states are default to be pruned in 24 hours.
        //If the application is paid, we want to hold on to it for longer in case we get locked in an error state.

        await this.applicationService.update(
          callback.paymentFlowMetadata.applicationId,
          {
            ...application,
            pruneAt: oneMonthFromNow,
          },
        )

        if (
          callback.details?.reason === 'payment_completed' &&
          callback.details?.message === 'Invoice payment completed'
        ) {
          // Clear up any existing payment reminders since we haven't state transitioned yet
          await this.applicationService.cancelScheduledNotifications(
            application.id,
          )
          const applicationLink = await this.paymentService.getApplicationUrl(
            application.id,
          )

          const notifications = createDailyCompletionNotifications(
            applicationLink,
            new Date(),
            oneMonthFromNow,
          )
          await this.applicationService.createScheduledNotifications(
            application.id,
            application.state,
            notifications,
          )
        }
      }
    }
  }
}
