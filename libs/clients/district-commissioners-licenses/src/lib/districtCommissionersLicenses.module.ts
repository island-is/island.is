import { Module } from '@nestjs/common'
import { DistrictCommissionersLicensesService } from './districtCommissionersLicenses.service'
import { RettindiFyrirIslandIsApi } from '../../gen/fetch'
import { DistrictCommissionerLicensesApiProvider } from './districtCommissionersLicenses.provider'

@Module({
  providers: [
    DistrictCommissionerLicensesApiProvider,
    DistrictCommissionersLicensesService,
  ],
  exports: [DistrictCommissionersLicensesService, RettindiFyrirIslandIsApi],
})
export class DistrictCommissionersLicensesClientModule {}
