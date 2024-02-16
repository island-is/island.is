import { Module } from '@nestjs/common'
import { DistrictCommissionerLicensesApiProvider } from './districtCommissionersLicenses.provider'
import { RettindiFyrirIslandIsApi } from '../../gen/fetch'

@Module({
  providers: [DistrictCommissionerLicensesApiProvider],
  exports: [RettindiFyrirIslandIsApi],
})
export class DistrictCommissionersLicensesClientModule {}
