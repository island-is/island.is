import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { InstitutionCollaborationService } from './institution-collaboration.service'
import { INSTITUTION_COLLABORATION_CONFIG } from './config/institutionApplicationServiceConfig'
import { FileStorageModule } from '@island.is/file-storage'

const applicationRecipientName =
  process.env.EMAIL_REPLY_TO_NAME ?? 'Recipient Name'

const applicationRecipientEmail =
  process.env.EMAIL_REPLY_TO ?? 'development@island.is'

const applicationSenderName = process.env.EMAIL_FROM_NAME ?? 'Sender Name'

const applicationSenderEmail = process.env.EMAIL_FROM ?? 'development@island.is'

export class InstitutionCollaborationModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: InstitutionCollaborationModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        FileStorageModule.register({}),
      ],
      providers: [
        {
          provide: INSTITUTION_COLLABORATION_CONFIG,
          useValue: {
            applicationRecipientName,
            applicationRecipientEmail,
            applicationSenderName,
            applicationSenderEmail,
          },
        },
        InstitutionCollaborationService,
      ],
      exports: [InstitutionCollaborationService],
    }
  }
}
