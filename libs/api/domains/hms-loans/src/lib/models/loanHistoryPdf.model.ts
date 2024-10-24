import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsLoansHistoryPdf')
export class LoanHistoryPdf {
  @Field(() => String, { nullable: true })
  mime?: string | null

  @Field(() => String, { nullable: true })
  data?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null
}
