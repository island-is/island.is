import { Args, Query, Resolver } from '@nestjs/graphql'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { CalculatorField } from './models/field.model'
import { CalculatorResultRow } from './models/resultRow.model'
import { CalculatorInputValue } from './dto/inputValue.input'
import { RskCalculatorType } from './models/enums'
import { RskCalculatorsService } from './rsk-calculators.service'

@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver()
export class RskCalculatorsResolver {
  constructor(private readonly service: RskCalculatorsService) {}

  @Query(() => [CalculatorField], {
    name: 'rskCalculatorFields',
    nullable: true,
    description:
      'The dynamic form schema for a given RSK calculator type. The web client renders a generic form from this schema.',
  })
  fields(
    @Args('calculatorType', { type: () => RskCalculatorType })
    calculatorType: RskCalculatorType,
  ): CalculatorField[] {
    return this.service.getFields(calculatorType)
  }

  @Query(() => [CalculatorResultRow], {
    name: 'rskCalculatorCalculation',
    nullable: true,
    description:
      'Runs an RSK calculator for the given calculator type and generic key/value input, matching the keys from rskCalculatorFields.',
  })
  async calculation(
    @Args('calculatorType', { type: () => RskCalculatorType })
    calculatorType: RskCalculatorType,
    @Args('input', { type: () => [CalculatorInputValue] })
    input: CalculatorInputValue[],
  ): Promise<CalculatorResultRow[]> {
    return this.service.calculate(calculatorType, input)
  }
}
