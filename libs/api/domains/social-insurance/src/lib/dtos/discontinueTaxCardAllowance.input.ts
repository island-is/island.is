import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, Max, Min } from 'class-validator'

@InputType('SocialInsuranceDiscontinueTaxCardAllowanceInput')
export class DiscontinueTaxCardAllowanceInput {
  @Field(() => Int)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year!: number

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number
}
