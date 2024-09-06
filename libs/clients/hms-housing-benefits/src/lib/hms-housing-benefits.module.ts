import { Module } from '@nestjs/common'
import { HmsHousingBenefitsApiProvider } from './hms-housing-benefits.provider'
import { HmsHousingBenefitsClientService } from './hms-housing-benefits.service'

@Module({
  providers: [HmsHousingBenefitsApiProvider, HmsHousingBenefitsClientService],
  exports: [HmsHousingBenefitsClientService],
})
export class HmsHousingBenefitsClientModule {}
