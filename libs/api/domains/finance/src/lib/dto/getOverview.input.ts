import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetFinancialOverviewInput {
  @Field()
  @IsString()
  OrgID!: string

  @Field()
  @IsString()
  chargeTypeID!: string
}
