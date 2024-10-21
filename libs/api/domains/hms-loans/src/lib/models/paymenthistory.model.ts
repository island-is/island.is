import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsLoansPaymentHistory')
export class PaymentHistory {
  @Field(() => Date, { nullable: true })
  paymentDate?: string | null

  @Field(() => Date, { nullable: true })
  transactionDate?: string | null

  @Field(() => Number, { nullable: true })
  paymentAmount?: number | null

  @Field(() => Number, { nullable: true })
  interest?: number | null

  @Field(() => Number, { nullable: true })
  priceImprovementPayment?: number | null

  @Field(() => Number, { nullable: true })
  priceImprovementInterest?: number | null

  @Field(() => Number, { nullable: true })
  costPayment?: number | null

  @Field(() => Number, { nullable: true })
  defaultInterest?: number | null

  @Field(() => Number, { nullable: true })
  totalPayment?: number | null

  @Field(() => Number, { nullable: true })
  loanId?: number | null
}
