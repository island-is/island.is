import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TagCount {
  @Field()
  key!: string

  @Field()
  value!: string

  @Field(() => Int)
  count!: string

  @Field({ nullable: true })
  type?: string
}
