import { Field, ObjectType, Float } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavePeriod {
  @Field(() => String)
  from!: string

  @Field(() => String)
  to!: string

  @Field(() => Float)
  ratio!: number // Ratio of usage in period.

  @Field(() => Boolean)
  approved!: boolean

  @Field(() => Boolean)
  paid!: boolean
}
