import { Args, Query, Resolver } from '@nestjs/graphql'
import { Calculation } from './models/calculation.model'
import { CalculationInput } from './dto/calculation.input'

@Resolver()
export class HousingBenefitCalculatorResolver {
  @Query(() => Calculation, { name: 'HousingBenefitCalculatorCalculation' })
  calculation(@Args('input') input: CalculationInput): Calculation {
    console.log('Calculation endpoint was called with:', input)
    return {
      maximumHousingBenefits: 48000,
      reductions: 12200,
      estimatedHousingBenefits: 48000 - 12200,
    }
  }
}
