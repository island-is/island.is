import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

@InputType('FeatureFlagAttributesInput')
export class FeatureFlagAttributesInput {
  @Field(() => String, { nullable: true })
  appVersion?: string

  @Field(() => String, { nullable: true })
  os?: string
}

@ObjectType('FeatureFlagValues')
export class FeatureFlagValues {
  @Field(() => GraphQLJSONObject)
  flags!: Record<string, boolean | string | number>
}
