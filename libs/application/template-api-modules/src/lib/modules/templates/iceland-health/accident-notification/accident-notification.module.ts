import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { ACCIDENT_NOTIFICATION_CONFIG } from './config'
import { AccidentNotificationService } from './accident-notification.service'
import { ApplicationAttachmentService } from './attachments/applicationAttachment.service'
import { AccidentNotificationAttachmentProvider } from './attachments/applicationAttachmentProvider'
import { RightsPortalClientModule } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { AwsModule } from '@island.is/nest/aws'

const applicationRecipientName =
  process.env.ACCIDENT_NOTIFICATION_APPLICATION_RECIPIENT_NAME ?? ''

const applicationRecipientEmail =
  process.env.ACCIDENT_NOTIFICATION_APPLICATION_RECIPIENT_EMAIL_ADDRESS ??
  'island@island.is'

const applicationSenderName = process.env.EMAIL_FROM_NAME ?? ''

const applicationSenderEmail = process.env.EMAIL_FROM ?? 'development@island.is'

@Module({
  imports: [SharedTemplateAPIModule, AwsModule, RightsPortalClientModule],
  providers: [
    {
      provide: ACCIDENT_NOTIFICATION_CONFIG,
      useValue: {
        applicationRecipientName,
        applicationRecipientEmail,
        applicationSenderName,
        applicationSenderEmail,
      },
    },
    AccidentNotificationService,
    ApplicationAttachmentService,
    AccidentNotificationAttachmentProvider,
  ],
  exports: [AccidentNotificationService],
})
export class AccidentNotificationModule {}
