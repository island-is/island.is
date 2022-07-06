import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TypeCount {
  @Field()
  key!: string

  @Field(() => Int)
  count!: string
}
