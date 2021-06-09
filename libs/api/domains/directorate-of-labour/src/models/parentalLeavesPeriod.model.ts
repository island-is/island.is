import { Field, ObjectType, Float } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavesPeriod {
  @Field(() => String)
  from!: string

  @Field(() => String)
  to!: string

  @Field(() => Float)
  ratio!: number

  @Field(() => Boolean)
  approved!: boolean

  @Field(() => Boolean)
  paid!: boolean

  @Field(() => String, { nullable: true })
  rightsCodePeriod?: string | null
}
