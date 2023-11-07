import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsLoansPaymentOverview')
export class PaymentOverview {
  @Field(() => Date, { nullable: true })
  gjalddagi?: Date

  @Field(() => Date, { nullable: true })
  hreyfingadagur?: Date

  @Field(() => Number, { nullable: true })
  afborgun?: number

  @Field(() => Number, { nullable: true })
  vextir?: number

  @Field(() => Number, { nullable: true })
  verdbAfborgun?: number

  @Field(() => Number, { nullable: true })
  verdbVextir?: number

  @Field(() => Number, { nullable: true })
  kostnadur?: number

  @Field(() => Number, { nullable: true })
  drattarvextir?: number

  @Field(() => Number, { nullable: true })
  samtals?: number

  @Field(() => Number, { nullable: true })
  lansnumer?: number
}
