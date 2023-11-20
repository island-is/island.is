import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsLoansPayment')
export class Paymenthistory {
  @Field(() => Date, { nullable: true })
  paymentDate?: Date

  @Field(() => Date, { nullable: true })
  transactionDate?: Date

  @Field(() => Number, { nullable: true })
  paymentAmount?: number

  @Field(() => Number, { nullable: true })
  interest?: number

  @Field(() => Number, { nullable: true })
  priceImprovementPayment?: number

  @Field(() => Number, { nullable: true })
  priceImprovementInterest?: number

  @Field(() => Number, { nullable: true })
  costPayment?: number

  @Field(() => Number, { nullable: true })
  defaultInterest?: number

  @Field(() => Number, { nullable: true })
  totalPayment?: number

  @Field(() => Number, { nullable: true })
  loanId?: number
}
