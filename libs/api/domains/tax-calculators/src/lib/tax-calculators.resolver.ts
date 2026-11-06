import { Args, Query, Resolver } from '@nestjs/graphql'

import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import { CalculateInput } from './models/calculateInput.model'
import { CalculateResponse } from './models/calculateResponse.model'
import { TaxCalculator } from './models/taxCalculator.model'
import { TaxCalculatorsService } from './tax-calculators.service'

/* Public unauthenticated queries; no identity or scope guards. */
@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver(() => TaxCalculator)
export class TaxCalculatorsResolver {
  constructor(private readonly taxCalculatorsService: TaxCalculatorsService) {}

  /* Static registry lookup; no external call. */
  @Query(() => TaxCalculator, {
    name: 'taxCalculator',
    description: 'Returns a calculator’s input and output contract.',
  })
  taxCalculator(
    @Args('type', { type: () => TaxCalculatorType })
    type: TaxCalculatorType,
  ): TaxCalculator {
    return this.taxCalculatorsService.getCalculator(type)
  }

  /* Nullable because calculation calls an external service. */
  @Query(() => CalculateResponse, {
    name: 'taxCalculatorCalculate',
    nullable: true,
    description: 'Calculates results from submitted input values.',
  })
  taxCalculatorCalculate(
    @Args('input') input: CalculateInput,
  ): Promise<CalculateResponse> {
    return this.taxCalculatorsService.calculate(input)
  }
}
