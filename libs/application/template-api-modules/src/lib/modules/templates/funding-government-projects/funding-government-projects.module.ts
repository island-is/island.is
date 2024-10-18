import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { FileStorageModule } from '@island.is/file-storage'
import { FUNDING_GOVERNMENT_PROJECTS_CONFIG } from './config/fundingFovernmentProjectsConfig'
import { FundingGovernmentProjectsService } from './funding-government-projects.service'

const applicationRecipientName =
  process.env.FUNDING_GOVERNMENT_PROJECTS_APPLICATION_RECIPIENT_NAME ?? ''

const applicationRecipientEmail =
  process.env.FUNDING_GOVERNMENT_PROJECTS_APPLICATION_RECIPIENT_EMAIL_ADDRESS ??
  'island@island.is'

const applicationSenderName = process.env.EMAIL_FROM_NAME ?? ''

const applicationSenderEmail = process.env.EMAIL_FROM ?? 'development@island.is'

@Module({
  imports: [SharedTemplateAPIModule, FileStorageModule],
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
})
export class FundingGovernmentProjectsModule {}
