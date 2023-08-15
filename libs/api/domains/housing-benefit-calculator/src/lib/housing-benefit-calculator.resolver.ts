import { Args, Query, Resolver } from '@nestjs/graphql'
import { HousingBenefitCalculatorClientService } from '@island.is/clients/housing-benefit-calculator'
import { CalculationResponse } from './models/calculation-response.model'
import { HousingBenefitCalculatorCalculationInput } from './dto/calculation.input'

@Resolver()
export class HousingBenefitCalculatorResolver {
  constructor(
    private readonly service: HousingBenefitCalculatorClientService,
  ) {}

  @Query(() => CalculationResponse, {
    name: 'housingBenefitCalculatorCalculation',
  })
  async calculation(
    @Args('input') input: HousingBenefitCalculatorCalculationInput,
  ) {
    return this.service.calculate(input)
  }
}
