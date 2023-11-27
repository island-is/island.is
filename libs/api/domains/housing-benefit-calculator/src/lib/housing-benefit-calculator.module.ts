import { Module } from '@nestjs/common'
import { HousingBenefitCalculatorClientModule } from '@island.is/clients/housing-benefit-calculator'
import { HousingBenefitCalculatorResolver } from './housing-benefit-calculator.resolver'

@Module({
  imports: [HousingBenefitCalculatorClientModule],
  providers: [HousingBenefitCalculatorResolver],
})
export class HousingBenefitCalculatorModule {}
