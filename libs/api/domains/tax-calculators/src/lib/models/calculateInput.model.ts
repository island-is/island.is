import { Field, InputType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'

import { TaxCalculatorType } from '@island.is/tax-calculators'

import { InputFieldValue } from './inputFieldValue.model'

@InputType('TaxCalculatorCalculateInput')
export class CalculateInput {
  @Field(() => TaxCalculatorType)
  type!: TaxCalculatorType

  @Field(() => [InputFieldValue], {
    description: 'Submitted values keyed by input-field key. Order is insignificant.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InputFieldValue)
  values!: InputFieldValue[]
}
