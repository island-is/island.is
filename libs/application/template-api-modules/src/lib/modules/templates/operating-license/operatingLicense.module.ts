import { DynamicModule } from '@nestjs/common'
import { OperatingLicenseService } from './operatingLicense.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'

export class OperatingLicenseModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OperatingLicenseModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [OperatingLicenseService],
      exports: [OperatingLicenseService],
    }
  }
}
