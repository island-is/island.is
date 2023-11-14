import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('FinancePaymentScheduleInput')
export class GetFinancePaymentScheduleInput {
  @Field()
  @IsString()
  scheduleNumber!: string
}
