import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NestedObjectEntry')
export class NestedObjectEntry {
  @Field(() => String, { nullable: true })
  key?: string

  @Field(() => [KeyValuePair], { nullable: true })
  value?: KeyValuePair[]
}

@ObjectType('KeyValuePair')
export class KeyValuePair {
  @Field(() => String, { nullable: true })
  key?: string

  @Field(() => String, { nullable: true })
  value?: string
}
