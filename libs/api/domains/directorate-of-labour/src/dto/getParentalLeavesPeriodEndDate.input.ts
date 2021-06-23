import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetParentalLeavesPeriodEndDateInput {
  @Field(() => String)
  @IsString()
  startDate!: string

  @Field(() => String)
  @IsString()
  length!: string

  @Field(() => String)
  @IsString()
  percentage!: string
}
