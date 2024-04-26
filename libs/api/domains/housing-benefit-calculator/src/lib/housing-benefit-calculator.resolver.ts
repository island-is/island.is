import { Args, Query, Resolver } from '@nestjs/graphql'
import { HousingBenefitCalculatorClientService } from '@island.is/clients/housing-benefit-calculator'
import { Calculation } from './models/calculation.model'
import { CalculationInput } from './dto/calculation.input'
import { SpecificSupportCalculationInput } from './dto/specificSupportCalculation.input'

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

  @Query(() => Calculation, {
    name: 'housingBenefitCalculatorSpecificSupportCalculation',
  })
  async specificSupportCalculation(
    @Args('input') input: SpecificSupportCalculationInput,
  ): Promise<Calculation> {
    return this.service.calculateSpecificSupport(input)
  }
}
