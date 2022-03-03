import { DynamicModule } from '@nestjs/common'
import { S3 } from 'aws-sdk'

import { HealthInsuranceV2Client } from '@island.is/clients/health-insurance-v2'

import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'

import { ApplicationAttachmentService } from './attachments/applicationAttachment.service'
import { AccidentNotificationAttachmentProvider } from './attachments/applicationAttachmentProvider'
import { S3Service } from './attachments/s3.service'
import { AccidentNotificationService } from './accident-notification.service'
import { ACCIDENT_NOTIFICATION_CONFIG } from './config'

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
        HealthInsuranceV2Client.register(config.healthInsuranceV2),
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
        S3Service,
        {
          provide: S3,
          useValue: new S3(),
        },
      ],
      exports: [AccidentNotificationService],
    }
  }
}
