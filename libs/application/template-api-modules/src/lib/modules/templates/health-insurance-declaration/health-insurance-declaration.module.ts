import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { HealthInsuranceDeclarationService } from './health-insurance-declaration.service'
import { RightsPortalClientModule } from '@island.is/clients/icelandic-health-insurance/rights-portal'

export class HealthInsuranceDeclarationModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: HealthInsuranceDeclarationModule,
      imports: [RightsPortalClientModule],
      providers: [HealthInsuranceDeclarationService],
      exports: [HealthInsuranceDeclarationService],
    }
  }
}
