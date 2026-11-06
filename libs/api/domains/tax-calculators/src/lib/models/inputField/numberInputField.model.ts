import { Field, Float, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorInputFieldSemantic } from '../enums'
import { InputField } from './inputField.model'

@ObjectType('TaxCalculatorNumberInputField', { implements: () => InputField })
export class NumberInputField extends InputField {
  @Field(() => TaxCalculatorInputFieldSemantic, { nullable: true })
  semantic?: TaxCalculatorInputFieldSemantic

  @Field(() => Float, { nullable: true })
  min?: number

  @Field(() => Float, { nullable: true })
  max?: number
}
