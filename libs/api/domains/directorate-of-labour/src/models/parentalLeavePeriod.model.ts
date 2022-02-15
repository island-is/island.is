import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavePeriod {
  @Field(() => String)
  from!: string

  @Field(() => String)
  to!: string

  @Field(() => String)
  ratio!: string

  @Field(() => Boolean)
  approved!: boolean

  @Field(() => Boolean)
  paid!: boolean

  @Field(() => String, { nullable: true })
  rightsCodePeriod?: string
}
