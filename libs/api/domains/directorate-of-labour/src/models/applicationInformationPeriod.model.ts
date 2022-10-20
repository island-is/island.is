import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class ApplicationInformationPeriod {
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

  @Field(() => String)
  rightsCodePeriod!: string

  @Field(() => String)
  firstPeriodStart!: string
}
