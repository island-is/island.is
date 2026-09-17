import { Field, InputType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsString, ValidateNested } from 'class-validator'

import { InputValue } from './inputValue.model'

@InputType('TaxCalculatorInputFieldValue')
export class InputFieldValue {
  @Field({
    description:
      'The `key` of the input field this value belongs to, exactly as the metadata query publishes it.',
  })
  @IsString()
  key!: string

  @Field(() => InputValue, {
    description:
      'The submitted value. An empty string is read as no value at all; to leave a field blank, omit this whole row.',
  })
  @ValidateNested()
  @Type(() => InputValue)
  value!: InputValue
}
