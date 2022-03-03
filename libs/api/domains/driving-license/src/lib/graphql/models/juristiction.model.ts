import { Field, ID,ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Juristiction {
  @Field(() => ID)
  id!: number

  @Field()
  zip!: number

  @Field()
  name!: string
}
