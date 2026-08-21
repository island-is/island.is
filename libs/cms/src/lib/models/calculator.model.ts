import { Field, ID, ObjectType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { ICalculator } from '../generated/contentfulTypes'

// The generic content type behind this model is deliberately named
// 'calculator', not 'rskCalculator' -- a cheap hedge in case the unrelated
// ECOI/WHODAS calculators are ever routed through the same mechanism. The
// GraphQL contract it renders against (calculatorType values, field/kind
// lookups) stays 100% RSK-specific for now; see rsk-calculators domain.
@ObjectType()
export class Calculator {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  calculatorType?: string

  @CacheField(() => GraphQLJSONObject, { nullable: true })
  configJson?: Record<string, any> | null

  @CacheField(() => GraphQLJSONObject, { nullable: true })
  translationStrings!: Record<string, string>
}

export const mapCalculator = ({
  sys,
  fields,
}: ICalculator): SystemMetadata<Calculator> => ({
  typename: 'Calculator',
  id: sys.id,
  title: fields?.title ?? '',
  calculatorType: fields?.calculatorType,
  configJson: fields?.configJson ?? null,
  translationStrings: fields?.translationNamespace?.fields?.strings ?? {},
})
