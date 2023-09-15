import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { DrivingLicenseDuplicateService } from './driving-license-duplicate.service'
import { DrivingLicenseModule } from '@island.is/api/domains/driving-license'

export class DrivingLicenseDuplicateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DrivingLicenseDuplicateModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        DrivingLicenseModule,
      ],
      providers: [DrivingLicenseDuplicateService],
      exports: [DrivingLicenseDuplicateService],
    }
  }
}
