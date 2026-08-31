import { Field, ID, ObjectType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { SystemMetadata } from '@island.is/shared/types'
import { ICalculator } from '../generated/contentfulTypes'

// The generic content type behind this model is deliberately named
// 'calculator', not 'rskCalculator' -- a cheap hedge in case the unrelated
// ECOI/WHODAS calculators are ever routed through the same mechanism. The
// GraphQL contract it renders against (calculatorType values, field/kind
// lookups) stays 100% RSK-specific for now; see tax-calculators domain.
@ObjectType()
export class Calculator {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  calculatorType?: string

  // `graphqlTypeJson` (the `JSON` scalar), not `GraphQLJSONObject` -- both
  // Calculator and ConnectedComponent are members of the `Slice` union and
  // both expose a `configJson` field; GraphQL's overlapping-fields-can-be-
  // merged validation rejects two differently-scoped scalars sharing a field
  // name across union members, so this must match ConnectedComponent's type.
  @Field(() => graphqlTypeJson, { nullable: true })
  configJson?: Record<string, any>
}

export const mapCalculator = ({
  sys,
  fields,
}: ICalculator): SystemMetadata<Calculator> => ({
  typename: 'Calculator',
  id: sys.id,
  calculatorType: fields?.type,
  configJson: fields?.configJson ?? undefined,
})
