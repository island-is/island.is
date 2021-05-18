import { Field, InputType } from '@nestjs/graphql'
import { IsString, Min } from 'class-validator'

@InputType()
export class GetFinancialOverviewInput {
  @Field()
  @IsString()
  @Min(1)
  OrgID!: string

  @Field()
  @IsString()
  @Min(1)
  chargeTypeID!: string
}
