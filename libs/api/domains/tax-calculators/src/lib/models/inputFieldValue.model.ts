import { Field, InputType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsString, ValidateNested } from 'class-validator'

import { InputValue } from './inputValue.model'

@InputType('TaxCalculatorInputFieldValue')
export class InputFieldValue {
  @Field()
  @IsString()
  key!: string

  @Field(() => InputValue, {
    description:
      'Submitted value for this field. An empty string is treated as absent.',
  })
  @ValidateNested()
  @Type(() => InputValue)
  value!: InputValue
}
