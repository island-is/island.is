import { Field, ObjectType } from '@nestjs/graphql'

import { InputFieldOption } from '../inputFieldOption.model'
import { InputField } from './inputField.model'

@ObjectType('TaxCalculatorSelectInputField', { implements: () => InputField })
export class SelectInputField extends InputField {
  @Field(() => [InputFieldOption], {
    description: 'Permitted values for this select field.',
  })
  options!: InputFieldOption[]
}
