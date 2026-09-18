import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import {
  calculatorConfigSchema,
  TaxCalculatorType,
} from '@island.is/tax-calculators'
import type { CalculatorConfig } from '@island.is/tax-calculators'
import { logger } from '@island.is/logging'
import { SystemMetadata } from '@island.is/shared/types'
import { ICalculator, ICalculatorFields } from '../generated/contentfulTypes'

// Named 'calculator', not 'rskCalculator' -- a hedge in case the unrelated
// ECOI/WHODAS calculators are ever routed through the same mechanism.
registerEnumType(TaxCalculatorType, {
  name: 'TaxCalculatorType',
  description: 'The tax calculator to use.',
})

@ObjectType()
export class Calculator {
  @Field(() => ID)
  id!: string

  @Field(() => TaxCalculatorType, { nullable: true })
  calculatorType?: TaxCalculatorType

  // `graphqlTypeJson` (the `JSON` scalar), not `GraphQLJSONObject` -- both
  // Calculator and ConnectedComponent are members of the `Slice` union and
  // both expose a `configJson` field; GraphQL's overlapping-fields-can-be-
  // merged validation rejects two differently-scoped scalars sharing a field
  // name across union members, so this must match ConnectedComponent's type.
  @Field(() => graphqlTypeJson, { nullable: true })
  configJson?: CalculatorConfig
}

const CALCULATOR_TYPE_BY_CONTENTFUL_VALUE: Record<
  ICalculatorFields['type'],
  TaxCalculatorType
> = {
  withholdingTaxOnWages: TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES,
  childBenefit: TaxCalculatorType.CHILD_BENEFIT,
  vehicleTax: TaxCalculatorType.VEHICLE_TAX,
  vehicleBenefit: TaxCalculatorType.VEHICLE_BENEFIT,
}

export const mapCalculator = ({
  sys,
  fields,
}: ICalculator): SystemMetadata<Calculator> => {
  /* Degrade, don't throw: throwing is swallowed by `safelyMapSliceUnion`, which
   * drops the slice entirely so nothing can tell "no calculator" from "a broken
   * one". Caught rather than `safeParse`d because search-indexer compiles this
   * library with `strict: false`, where zod's discriminant does not narrow. */
  let configJson: CalculatorConfig | undefined

  try {
    configJson = calculatorConfigSchema.parse(fields?.configJson)
  } catch (error) {
    logger.warn('Invalid calculator config', {
      id: sys.id,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return {
    typename: 'Calculator',
    id: sys.id,
    calculatorType: fields?.type
      ? CALCULATOR_TYPE_BY_CONTENTFUL_VALUE[fields.type]
      : undefined,
    configJson,
  }
}
