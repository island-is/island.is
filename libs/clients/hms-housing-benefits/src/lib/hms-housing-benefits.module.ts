import { Module } from '@nestjs/common'
import {
  HmsHousingBenefitsApiProvider,
  HmsHousingBenefitsApplicationApiProvider,
} from './hms-housing-benefits.provider'
import { HmsHousingBenefitsClientService } from './hms-housing-benefits.service'

@Module({
  providers: [
    HmsHousingBenefitsApiProvider,
    HmsHousingBenefitsApplicationApiProvider,
    HmsHousingBenefitsClientService,
  ],
  exports: [HmsHousingBenefitsClientService],
})
export class HmsHousingBenefitsClientModule {}
