import { Module } from '@nestjs/common'
import { HomeLodgingsApiProvider } from './homeLodgings.provider'
import { DistrictCommissionersHomeLodgingsService } from './homeLodgings.service'

@Module({
  providers: [
    HomeLodgingsApiProvider,
    DistrictCommissionersHomeLodgingsService,
  ],
  exports: [DistrictCommissionersHomeLodgingsService],
})
export class DistrictCommissionersHomeLodgingsClientModule {}
