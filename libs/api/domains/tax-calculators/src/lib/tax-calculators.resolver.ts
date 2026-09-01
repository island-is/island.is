import { Args, Query, Resolver } from '@nestjs/graphql'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { CalculatorField } from './models/field.model'
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
}
