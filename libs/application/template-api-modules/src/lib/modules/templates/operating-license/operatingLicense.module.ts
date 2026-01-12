import { Module } from '@nestjs/common'
import { OperatingLicenseService } from './operatingLicense.service'
import { SharedTemplateAPIModule } from '../../shared'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { FinanceClientModule } from '@island.is/clients/finance'
import { JudicialAdministrationClientModule } from '@island.is/clients/judicial-administration'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    SyslumennClientModule,
    SharedTemplateAPIModule,
    FinanceClientModule,
    JudicialAdministrationClientModule,
    AwsModule,
  ],
  providers: [OperatingLicenseService],
  exports: [OperatingLicenseService],
})
export class OperatingLicenseModule {}
