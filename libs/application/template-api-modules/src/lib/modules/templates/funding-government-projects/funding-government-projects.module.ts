import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { FileStorageModule } from '@island.is/file-storage'
import { FUNDING_GOVERNMENT_PROJECTS_CONFIG } from './config/fundingFovernmentProjectsConfig'
import { FundingGovernmentProjectsService } from './funding-government-projects.service'

const applicationRecipientName =
  process.env.INSTITUTION_APPLICATION_RECIPIENT_NAME ?? ''

const applicationRecipientEmail =
  process.env.INSTITUTION_APPLICATION_RECIPIENT_EMAIL_ADDRESS ??
  'island@island.is'

const applicationSenderName = process.env.EMAIL_FROM_NAME ?? ''

const applicationSenderEmail = process.env.EMAIL_FROM ?? 'development@island.is'

export class FundingGovernmentProjectsModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: FundingGovernmentProjectsModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        FileStorageModule.register({}),
      ],
      providers: [
        {
          provide: FUNDING_GOVERNMENT_PROJECTS_CONFIG,
          useValue: {
            applicationRecipientName,
            applicationRecipientEmail,
            applicationSenderName,
            applicationSenderEmail,
          },
        },
        FundingGovernmentProjectsService,
      ],
      exports: [FundingGovernmentProjectsService],
    }
  }
}
