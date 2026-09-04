import { Args, Query, Resolver } from '@nestjs/graphql'

import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import { CalculatorField } from './models/field.model'
import { TaxCalculatorsService } from './tax-calculators.service'

/* Public, unauthenticated: the consumer is the Contentful-driven Calculator
 * slice on the public web, so no IdsUserGuard/ScopesGuard/@Audit here. */
@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver(() => CalculatorField)
export class TaxCalculatorsResolver {
  constructor(private readonly taxCalculatorsService: TaxCalculatorsService) {}

  @Query(() => [CalculatorField], {
    name: 'taxCalculatorFields',
    nullable: true,
    description:
      'The input contract for a calculator: which fields RSK accepts, of what kind, and under what condition. Display text and layout come from the Contentful `configJson`, not from here.',
  })
  taxCalculatorFields(
    /* TaxCalculatorType is declared in @island.is/tax-calculators and
     * registered with GraphQL by libs/cms/src/lib/models/calculator.model.ts,
     * following CustomPageUniqueIdentifier. This module must never call
     * registerEnumType for it -- registering twice throws. */
    @Args('calculatorType', { type: () => TaxCalculatorType })
    calculatorType: TaxCalculatorType,
  ): CalculatorField[] {
    return this.taxCalculatorsService.getFields(calculatorType)
  }
}
