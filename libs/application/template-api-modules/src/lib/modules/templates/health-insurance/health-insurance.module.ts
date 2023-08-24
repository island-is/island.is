import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { HealthInsuranceService } from './health-insurance.service'
import { HealthInsuranceV2Client } from '@island.is/clients/icelandic-health-insurance/health-insurance'
import { BucketService } from './bucket/bucket.service'

export class HealthInsuranceModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: HealthInsuranceModule,
      imports: [
        HealthInsuranceV2Client.register(config.healthInsuranceV2),
        SharedTemplateAPIModule.register(config),
      ],
      providers: [HealthInsuranceService, BucketService],
      exports: [HealthInsuranceService],
    }
  }
}
