import { DynamicModule } from '@nestjs/common'
import { OperatingLicenseService } from './operatingLicense.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { CriminalRecordModule } from '@island.is/api/domains/criminal-record'
import { FinanceClientModule } from '@island.is/clients/finance'
import { CourtBankruptcyCertClientModule } from '@island.is/clients/court-bankruptcy-cert'

export class OperatingLicenseModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OperatingLicenseModule,
      imports: [
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
        CriminalRecordModule.register(config.criminalRecord),
        FinanceClientModule,
        CourtBankruptcyCertClientModule,
      ],
      providers: [OperatingLicenseService],
      exports: [OperatingLicenseService],
    }
  }
}
