import { Module } from '@nestjs/common'
import { OperatingLicenseService } from './operatingLicense.service'
import { SharedTemplateAPIModule } from '../../shared'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { CriminalRecordModule } from '@island.is/api/domains/criminal-record'
import { FinanceClientModule } from '@island.is/clients/finance'
import { JudicialAdministrationClientModule } from '@island.is/clients/judicial-administration'

@Module({
  imports: [
    SyslumennClientModule,
    SharedTemplateAPIModule,
    CriminalRecordModule,
    FinanceClientModule,
    JudicialAdministrationClientModule,
  ],
  providers: [OperatingLicenseService],
  exports: [OperatingLicenseService],
})
export class OperatingLicenseModule {}
