import { Module } from '@nestjs/common'
import {
  HmsHousingBenefitsApiProvider,
  HmsHousingBenefitsApplicationApiProvider,
  HmsHousingBenefitsTaxApiProvider,
} from './hms-housing-benefits.provider'
import { HmsHousingBenefitsClientService } from './hms-housing-benefits.service'

@Module({
  providers: [
    HmsHousingBenefitsApiProvider,
    HmsHousingBenefitsApplicationApiProvider,
    HmsHousingBenefitsTaxApiProvider,
    HmsHousingBenefitsClientService,
  ],
  exports: [HmsHousingBenefitsClientService],
})
export class HmsHousingBenefitsClientModule {}
