import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('TaxCalculatorInputValue')
export class CalculatorInputValue {
  @Field(() => String)
  @IsString()
  key!: string

  @Field(() => String)
  @IsString()
  value!: string
}
