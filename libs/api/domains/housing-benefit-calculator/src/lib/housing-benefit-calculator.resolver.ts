import { Args, Query, Resolver } from '@nestjs/graphql'
import { HousingBenefitCalculatorClientService } from '@island.is/clients/housing-benefit-calculator'
import { Calculation } from './models/calculation.model'
import { CalculationInput } from './dto/calculation.input'

@Resolver()
export class HousingBenefitCalculatorResolver {
  constructor(
    private readonly service: HousingBenefitCalculatorClientService,
  ) {}

  @Query(() => Calculation, { name: 'housingBenefitCalculatorCalculation' })
  async calculation(
    @Args('input') input: CalculationInput,
  ): Promise<Calculation> {
    return this.service.calculate(input)
  }
}
