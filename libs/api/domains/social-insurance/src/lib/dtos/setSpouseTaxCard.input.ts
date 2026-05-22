import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, Max, Min } from 'class-validator'

@InputType('SocialInsuranceSetSpouseTaxCardInput')
export class SetSpouseTaxCardInput {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Max(100)
  percentage!: number

  @Field(() => Int)
  @IsInt()
  year!: number

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number
}
