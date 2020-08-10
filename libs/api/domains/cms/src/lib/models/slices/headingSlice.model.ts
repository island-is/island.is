import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HeadingSlice {
  constructor(initializer: HeadingSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string
}
