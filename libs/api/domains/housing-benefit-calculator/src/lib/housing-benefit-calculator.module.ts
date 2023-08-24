import { Module } from '@nestjs/common'
import { HousingBenefitCalculatorResolver } from './housing-benefit-calculator.resolver'

@Module({
  providers: [HousingBenefitCalculatorResolver],
})
export class HousingBenefitCalculatorModule {}
