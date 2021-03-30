import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { InstitutionCollaborationService } from './institution-collaboration.service'
import { INSTITUTION_COLLABORATION_CONFIG } from './config/institutionApplicationServiceConfig'
import { FileStorageModule } from '@island.is/file-storage'

const recipientEmailAddress =
  process.env.INSTITUTION_COLLABORATION_RECIPIENT_EMAIL_ADDRESS ??
  'development@island.is'
const senderEmailAddress =
  process.env.INSTITUTION_COLLABORATION_SENDER_EMAIL_ADDRESS ??
  'development@island.is'

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
          useValue: { recipientEmailAddress, senderEmailAddress },
        },
        InstitutionCollaborationService,
      ],
      exports: [InstitutionCollaborationService],
    }
  }
}
