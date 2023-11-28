import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsLoansLoanHistoryPdf')
export class LoanHistoryPdf {
  @Field(() => String, { nullable: true })
  mime?: string

  @Field(() => String, { nullable: true })
  data?: string

  @Field(() => String, { nullable: true })
  name?: string
}
