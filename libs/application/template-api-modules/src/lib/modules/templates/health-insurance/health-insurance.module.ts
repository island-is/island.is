import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'
import { HealthInsuranceModule as HealthInsuranceModuleBackend, HealthInsuranceConfig } from '@island.is/api/domains/health-insurance'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { HealthInsuranceService } from './health-insurance.service'

export class HealthInsuranceModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: HealthInsuranceModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [HealthInsuranceService],
      exports: [HealthInsuranceService],
    }
  }
}
