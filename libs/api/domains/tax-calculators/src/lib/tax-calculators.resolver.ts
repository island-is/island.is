import { Args, Query, Resolver } from '@nestjs/graphql'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { CalculatorField } from './models/field.model'
import { CalculatorCalculationResult } from './models/calculationResult.model'
import { CalculatorInputValue } from './dto/inputValue.input'
import { TaxCalculatorType } from './models/enums'
import { TaxCalculatorsService } from './tax-calculators.service'

@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver()
export class TaxCalculatorsResolver {
  constructor(private readonly service: TaxCalculatorsService) {}

  @Query(() => [CalculatorField], {
    name: 'taxCalculatorFields',
    nullable: true,
    description:
      'The dynamic form schema for a given tax calculator type. The web client renders a generic form from this schema.',
  })
  fields(
    @Args('calculatorType', { type: () => TaxCalculatorType })
    calculatorType: TaxCalculatorType,
  ): CalculatorField[] {
    return this.service.getFields(calculatorType)
  }

  @Query(() => CalculatorCalculationResult, {
    name: 'taxCalculatorCalculation',
    nullable: true,
    description:
      'Runs a tax calculator for the given calculator type and generic key/value input, matching the keys from taxCalculatorFields.',
  })
  async calculation(
    @Args('calculatorType', { type: () => TaxCalculatorType })
    calculatorType: TaxCalculatorType,
    @Args('input', { type: () => [CalculatorInputValue] })
    input: CalculatorInputValue[],
  ): Promise<CalculatorCalculationResult> {
    return this.service.calculate(calculatorType, input)
  }
}
