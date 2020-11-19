import { Field, Float, InputType } from '@nestjs/graphql'
import { IsString, IsNumber, IsBoolean, IsObject } from 'class-validator'

@InputType()
class Period {
  @Field(() => String)
  @IsString()
  from!: string

  @Field(() => String)
  @IsString()
  to!: string

  @Field(() => Float)
  @IsNumber()
  ratio!: number // Ratio of usage in period.

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

  @Field(() => Period)
  @IsObject()
  period!: Period
}
