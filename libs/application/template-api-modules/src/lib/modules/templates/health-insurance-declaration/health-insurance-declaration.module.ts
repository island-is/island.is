import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { HealthInsuranceDeclarationService } from './health-insurance-declaration.service'
import { RightsPortalClientModule } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { FileStorageModule } from '@island.is/file-storage'
import { ApplicationAttachmentProvider } from './attachments/provider'
import { SharedTemplateAPIModule } from '../../shared'

export class HealthInsuranceDeclarationModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: HealthInsuranceDeclarationModule,
      imports: [
        RightsPortalClientModule,
        FileStorageModule,
        SharedTemplateAPIModule.register(config),
      ],
      providers: [
        HealthInsuranceDeclarationService,
        ApplicationAttachmentProvider,
      ],
      exports: [HealthInsuranceDeclarationService],
    }
  }
}
