import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { GeneralFishingLicenseService } from './general-fishing-license.service'

export class GeneralFishingLicenseModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: GeneralFishingLicenseModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [GeneralFishingLicenseService],
      exports: [GeneralFishingLicenseService],
    }
  }
}
