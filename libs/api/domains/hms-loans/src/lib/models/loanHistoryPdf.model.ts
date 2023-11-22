import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsLoansLoanhistoryPdf')
export class LoanhistoryPdf {
  @Field(() => String, { nullable: true })
  mime?: string

  @Field(() => String, { nullable: true })
  data?: string

  @Field(() => String, { nullable: true })
  name?: string
}
