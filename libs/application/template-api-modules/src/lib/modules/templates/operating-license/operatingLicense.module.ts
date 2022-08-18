import { DynamicModule } from '@nestjs/common'
import { OperatingLicenseService } from './operatingLicense.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

export class OperatingLicenseModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OperatingLicenseModule,
      imports: [
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
      ],
      providers: [OperatingLicenseService],
      exports: [OperatingLicenseService],
    }
  }
}
