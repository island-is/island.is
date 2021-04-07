import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { InstitutionCollaborationService } from './institution-collaboration.service'
import { INSTITUTION_COLLABORATION_CONFIG } from './config/institutionApplicationServiceConfig'
import { FileStorageModule } from '@island.is/file-storage'

const applicationRecipientName =
  process.env.INSTITUTION_APPLICATION_RECIPIENT_NAME ?? ''

const applicationRecipientEmail =
  process.env.INSTITUTION_APPLICATION_RECIPIENT_EMAIL_ADDRESS ??
  'island@island.is'

const applicationSenderName = process.env.EMAIL_FROM_NAME ?? ''

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
