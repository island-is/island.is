import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNumber, IsBoolean, IsArray } from 'class-validator'

@InputType()
class Period {
  @Field(() => String)
  @IsString()
  from!: string

  @Field(() => String)
  @IsString()
  to!: string

  @Field(() => String)
  @IsNumber()
  ratio!: string // Ratio of usage in period.

  @Field(() => Boolean)
  @IsBoolean()
  approved!: boolean

  @Field(() => Boolean)
  @IsBoolean()
  paid!: boolean
}

@InputType()
export class GetParentalLeavesEstimatedPaymentPlanInput {
  @Field(() => String)
  @IsString()
  dateOfBirth!: string

  @Field(() => [Period])
  @IsArray()
  period!: Period[]
}
