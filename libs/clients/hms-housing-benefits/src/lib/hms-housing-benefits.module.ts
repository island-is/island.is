import { Module } from '@nestjs/common'
import { HmsHousingBenefitsApiProvider } from './hms-housing-benefits.provider'

@Module({
  providers: [HmsHousingBenefitsApiProvider],
  exports: [HmsHousingBenefitsApiProvider],
})
export class HmsHousingBenefitsClientModule {}
