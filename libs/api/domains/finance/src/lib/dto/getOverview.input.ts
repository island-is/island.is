import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('FinanceFinancialOverviewInput')
export class GetFinancialOverviewInput {
  @Field()
  @IsString()
  orgID!: string

  @Field()
  @IsString()
  chargeTypeID!: string
}
