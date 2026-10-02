import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('AirDiscountSchemeMostFlownRoute')
export class MostFlownRoute {
  @Field()
  route!: string

  @Field(() => Int)
  count!: number
}
