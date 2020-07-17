import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NumberBullet {
  @Field((type) => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string
}
