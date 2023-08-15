import { Module } from '@nestjs/common'
import { ApiConfig } from './housing-benefit-calculator.config'
import { HousingBenefitCalculatorClientService } from './housing-benefit-client.service'

@Module({
  providers: [ApiConfig, HousingBenefitCalculatorClientService],
  exports: [HousingBenefitCalculatorClientService],
})
export class HousingBenefitCalculatorClientModule {}
