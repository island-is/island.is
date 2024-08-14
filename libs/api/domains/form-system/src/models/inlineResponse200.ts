import { Field, ObjectType } from '@nestjs/graphql'
import { NestedObjectEntry } from './global.model'

@ObjectType('FormSystemInlineResponse200')
export class InlineResponse200 {
  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => [NestedObjectEntry], { nullable: true })
  info?: NestedObjectEntry[] | null

  @Field(() => [NestedObjectEntry], { nullable: true })
  error?: NestedObjectEntry[] | null

  @Field(() => [NestedObjectEntry], { nullable: true })
  details?: NestedObjectEntry[]
}
