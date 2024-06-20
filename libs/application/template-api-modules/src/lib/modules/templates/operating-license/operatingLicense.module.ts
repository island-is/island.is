import { DynamicModule } from '@nestjs/common'
import { OperatingLicenseService } from './operatingLicense.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { CriminalRecordModule } from '@island.is/api/domains/criminal-record'
import { FinanceClientModule } from '@island.is/clients/finance'
import { JudicialAdministrationClientModule } from '@island.is/clients/judicial-administration'

export class OperatingLicenseModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OperatingLicenseModule,
      imports: [
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
        CriminalRecordModule,
        FinanceClientModule,
        JudicialAdministrationClientModule,
      ],
      providers: [OperatingLicenseService],
      exports: [OperatingLicenseService],
    }
  }
}
