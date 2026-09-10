import { Args, Query, Resolver } from '@nestjs/graphql'

import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import { TaxCalculator } from './models/taxCalculator.model'
import { TaxCalculatorsService } from './tax-calculators.service'

/* Public, unauthenticated: the consumer is the Contentful-driven Calculator
 * slice on the public web, so no IdsUserGuard/ScopesGuard/@Audit here. */
@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver(() => TaxCalculator)
export class TaxCalculatorsResolver {
  constructor(private readonly taxCalculatorsService: TaxCalculatorsService) {}

  /* Non-nullable, deviating from conventions/graphql.md's "all root Query
   * fields must be nullable". That rule exists for queries fronting a service
   * that can be down; this one reads a static in-process registry, so the only
   * way it can fail is a publication-invariant violation -- a contract bug the
   * domain tests catch, which the roadmap deliberately wants to surface rather
   * than degrade around. */
  @Query(() => TaxCalculator, {
    name: 'taxCalculator',
    description:
      'The input contract for a calculator: which fields RSK accepts, of what kind, and under what condition. Display text and layout come from the Contentful `configJson`, not from here.',
  })
  taxCalculator(
    /* TaxCalculatorType is declared in @island.is/tax-calculators and
     * registered with GraphQL by libs/cms/src/lib/models/calculator.model.ts.
     * This module must never call registerEnumType for it -- registering
     * twice throws. */
    @Args('type', { type: () => TaxCalculatorType })
    type: TaxCalculatorType,
  ): TaxCalculator {
    return this.taxCalculatorsService.getCalculator(type)
  }
}
