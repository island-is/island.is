import { Module } from '@nestjs/common'
import { ApiConfig, ApiProviders } from './housing-benefit-calculator.provider'
import { HousingBenefitCalculatorClientService } from './housing-benefit-calculator.service'

@Module({
  providers: [
    ApiConfig,
    ...ApiProviders,
    HousingBenefitCalculatorClientService,
  ],
  exports: [HousingBenefitCalculatorClientService],
})
export class HousingBenefitCalculatorClientModule {}
