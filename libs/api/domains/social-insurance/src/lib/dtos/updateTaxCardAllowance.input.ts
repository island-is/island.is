import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, Max, Min } from 'class-validator'

@InputType('SocialInsuranceUpdateTaxCardAllowanceInput')
export class UpdateTaxCardAllowanceInput {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Max(100)
  percentage!: number
}
