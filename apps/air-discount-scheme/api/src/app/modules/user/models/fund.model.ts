import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Fund {
  @Field()
  credit: number

  @Field()
  used: number

  @Field()
  total: number
}
