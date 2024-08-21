import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { ACCIDENT_NOTIFICATION_CONFIG } from './config'
import { AccidentNotificationService } from './accident-notification.service'
import { HealthInsuranceV2ClientModule } from '@island.is/clients/icelandic-health-insurance/health-insurance'
import { ApplicationAttachmentService } from './attachments/applicationAttachment.service'
import { AccidentNotificationAttachmentProvider } from './attachments/applicationAttachmentProvider'
import { AwsService } from '@island.is/nest/aws'

const applicationRecipientName =
  process.env.ACCIDENT_NOTIFICATION_APPLICATION_RECIPIENT_NAME ?? ''

const applicationRecipientEmail =
  process.env.ACCIDENT_NOTIFICATION_APPLICATION_RECIPIENT_EMAIL_ADDRESS ??
  'island@island.is'

const applicationSenderName = process.env.EMAIL_FROM_NAME ?? ''

const applicationSenderEmail = process.env.EMAIL_FROM ?? 'development@island.is'

export class AccidentNotificationModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: AccidentNotificationModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        HealthInsuranceV2ClientModule,
      ],
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
        {
          provide: AwsService,
          useValue: new AwsService(),
        },
      ],
      exports: [AccidentNotificationService],
    }
  }
}
