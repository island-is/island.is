import { Module } from '@nestjs/common'
import { OccupationalLicensesClientService } from './occupationalLicensesClient.service'
import { OccupationalLicensesApiProvider } from './apiProvider'

@Module({
  providers: [
    OccupationalLicensesApiProvider,
    OccupationalLicensesClientService,
  ],
  exports: [OccupationalLicensesClientService],
})
export class OccupationalLicensesClientModule {}
