import { Field, ObjectType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

@ObjectType('FeatureFlagValues')
export class FeatureFlagValues {
  @Field(() => GraphQLJSONObject)
  flags!: Record<string, boolean | string>
}
