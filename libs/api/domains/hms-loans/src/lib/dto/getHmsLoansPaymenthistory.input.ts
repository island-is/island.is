import { Field, InputType } from '@nestjs/graphql'
import { IsNumber } from 'class-validator'

@InputType()
export class GetHmsLoansPaymentHistoryInput {
  @Field()
  @IsNumber()
  loanId!: number
}
