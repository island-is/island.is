import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsLoansHistoryPdf')
export class LoanHistoryPdf {
  @Field(() => String, { nullable: true })
  mime?: string

  @Field(() => String, { nullable: true })
  data?: string

  @Field(() => String, { nullable: true })
  name?: string
}
