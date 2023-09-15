import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { DrivingLicenseSubmissionService } from './driving-license-submission.service'
import { DrivingLicenseModule } from '@island.is/api/domains/driving-license'

export class DrivingLicenseSubmissionModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DrivingLicenseSubmissionModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        DrivingLicenseModule,
      ],
      providers: [DrivingLicenseSubmissionService],
      exports: [DrivingLicenseSubmissionService],
    }
  }
}
