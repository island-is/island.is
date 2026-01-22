import { Module } from '@nestjs/common'
import { HealthInsuranceDeclarationService } from './health-insurance-declaration.service'
import { RightsPortalClientModule } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { FileStorageModule } from '@island.is/file-storage'
import { ApplicationAttachmentProvider } from './attachments/provider'
import { SharedTemplateAPIModule } from '../../../shared'

@Module({
  imports: [
    RightsPortalClientModule,
    FileStorageModule,
    SharedTemplateAPIModule,
  ],
  providers: [HealthInsuranceDeclarationService, ApplicationAttachmentProvider],
  exports: [HealthInsuranceDeclarationService],
})
export class HealthInsuranceDeclarationModule {}
