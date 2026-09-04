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

// The generic content type behind this model is deliberately named
// 'calculator', not 'rskCalculator' -- a cheap hedge in case the unrelated
// ECOI/WHODAS calculators are ever routed through the same mechanism. The
// GraphQL contract it renders against (calculatorType values, field/kind
// lookups) stays 100% RSK-specific for now; see tax-calculators domain.
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

/* A string literal does not satisfy a string enum type, so the generated
 * Contentful union maps across explicitly rather than being cast. */
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
  const config = calculatorConfigSchema.safeParse(fields?.configJson)

  /* Degrade, don't throw. `configJson` is declared nullable and the web client
   * already handles a missing config; throwing would instead be swallowed by
   * `safelyMapSliceUnion`, dropping the slice from the response entirely so
   * nothing downstream can tell "no calculator" from "a broken one". Editors
   * are gated at authoring time by the Contentful widget's setInvalid. */
  if (!config.success) {
    logger.warn('Invalid calculator config', {
      id: sys.id,
      error: config.error.message,
    })
  }

  return {
    typename: 'Calculator',
    id: sys.id,
    calculatorType: fields?.type
      ? CALCULATOR_TYPE_BY_CONTENTFUL_VALUE[fields.type]
      : undefined,
    configJson: config.success ? config.data : undefined,
  }
}
