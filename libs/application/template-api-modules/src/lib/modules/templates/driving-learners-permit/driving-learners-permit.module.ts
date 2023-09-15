import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { DrivingLearnersPermitService } from './driving-learners-permit.service'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'

export class DrivingLearnersPermitModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DrivingLearnersPermitModule,
      imports: [
        DrivingLicenseApiModule,
        SharedTemplateAPIModule.register(config),
      ],
      providers: [DrivingLearnersPermitService],
      exports: [DrivingLearnersPermitService],
    }
  }
}
