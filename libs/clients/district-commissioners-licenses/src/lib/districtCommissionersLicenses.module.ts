import { Module } from '@nestjs/common'
import { DistrictCommissionersLicensesService } from './districtCommissionersLicenses.service'
import { RettindiFyrirIslandIsApi } from '../../gen/fetch'
import { DistrictCommissionerLicensesApiProvider2 } from './districtCommissionersLicenses2.provider'
import { DistrictCommissionerLicensesApiProvider } from './districtCommissionersLicenses.provider'

@Module({
  providers: [
    DistrictCommissionerLicensesApiProvider,
    DistrictCommissionerLicensesApiProvider2,
    DistrictCommissionersLicensesService,
  ],
  exports: [DistrictCommissionersLicensesService, RettindiFyrirIslandIsApi],
})
export class DistrictCommissionersLicensesClientModule {}
