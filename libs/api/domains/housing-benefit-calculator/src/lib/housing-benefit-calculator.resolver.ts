import { Query, Resolver } from '@nestjs/graphql'
import { Calculation } from './models/calculation.model'

@Resolver()
export class HousingBenefitCalculatorResolver {
  @Query(() => Calculation, { name: 'HousingBenefitCalculatorCalculation' })
  calculation(): Calculation {
    return {
      estimatedHousingBenefits: 100,
      maxBenefitPerMonth: 110,
      reductionsDueToIncome: 120,
    }
  }
}
