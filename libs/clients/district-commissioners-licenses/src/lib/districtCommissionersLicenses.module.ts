import { Module } from '@nestjs/common'
import { DistrictCommissionerLicensesApiProvider } from './districtCommissionersLicenses.provider'
import { DistrictCommissionersLicensesService } from './districtCommissionersLicenses.service'
import { RettindiFyrirIslandIsApi } from '../../gen/fetch'

@Module({
  providers: [
    DistrictCommissionerLicensesApiProvider,
    DistrictCommissionersLicensesService,
  ],
  exports: [DistrictCommissionersLicensesService, RettindiFyrirIslandIsApi],
})
export class DistrictCommissionersLicensesClientModule {}
