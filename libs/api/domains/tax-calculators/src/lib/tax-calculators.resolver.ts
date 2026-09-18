import { Args, Query, Resolver } from '@nestjs/graphql'

import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import { CalculateInput } from './models/calculateInput.model'
import { CalculateResponse } from './models/calculateResponse.model'
import { TaxCalculator } from './models/taxCalculator.model'
import { TaxCalculatorsService } from './tax-calculators.service'

/* Public, unauthenticated: the consumer is the public web slice, so no
 * IdsUserGuard/ScopesGuard/@Audit here. */
@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver(() => TaxCalculator)
export class TaxCalculatorsResolver {
  constructor(private readonly taxCalculatorsService: TaxCalculatorsService) {}

  /* Non-nullable, deviating from conventions/graphql.md: that rule is for
   * queries fronting a service that can be down. This reads a static
   * in-process registry. */
  @Query(() => TaxCalculator, {
    name: 'taxCalculator',
    description:
      'The contract for a calculator: which fields RSK accepts as input, of what kind and under what condition, and which values it returns. Metadata only -- this runs no calculation. Display text and layout come from the Contentful `configJson`, not from here.',
  })
  taxCalculator(
    /* Registered with GraphQL by libs/cms's calculator.model.ts -- never call
     * registerEnumType for it here, registering twice throws. */
    @Args('type', { type: () => TaxCalculatorType })
    type: TaxCalculatorType,
  ): TaxCalculator {
    return this.taxCalculatorsService.getCalculator(type)
  }

  /* Nullable per conventions/graphql.md, unlike the sibling above: this fronts
   * a network call to RSK. */
  @Query(() => CalculateResponse, {
    name: 'taxCalculatorCalculate',
    nullable: true,
    description:
      'Runs one calculator against submitted values and returns its results keyed by output field, or the reasons it did not run. Read the contract from `taxCalculator` first: which fields to submit, of what kind, and under what condition, all come from there.',
  })
  taxCalculatorCalculate(
    @Args('input') input: CalculateInput,
  ): Promise<CalculateResponse> {
    return this.taxCalculatorsService.calculate(input)
  }
}
