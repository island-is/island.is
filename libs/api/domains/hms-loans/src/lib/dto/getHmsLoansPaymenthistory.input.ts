import { Field, InputType } from '@nestjs/graphql'
import { IsNumber } from 'class-validator'

@InputType()
export class GetHmsLoansPaymenthistoryInput {
  @Field()
  @IsNumber()
  loanId!: number
}
