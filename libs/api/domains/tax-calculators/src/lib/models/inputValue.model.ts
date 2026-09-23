import { Field, Float, InputType } from '@nestjs/graphql'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

@InputType('TaxCalculatorInputValue', {
  isOneOf: true,
  description:
    'Typed submitted value. Set exactly one payload matching the input-field type.',
})
export class InputValue {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  numberValue?: number

  @Field({
    nullable: true,
    description:
      'Value for a `STRING`, `DATE`, or `SELECT` field. Dates use `yyyy-MM-dd`.',
  })
  @IsOptional()
  @IsString()
  stringValue?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  booleanValue?: boolean
}
