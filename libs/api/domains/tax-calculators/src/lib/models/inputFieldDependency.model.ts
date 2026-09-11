import { Field, ObjectType } from '@nestjs/graphql'

import {
  InputDependencyValue,
  type InputDependencyValueUnion,
} from './inputDependencyValue.model'

@ObjectType('TaxCalculatorInputFieldDependency')
export class InputFieldDependency {
  @Field({
    description:
      "The `key` of the sibling field this one is conditional on. Not this field's own key.",
  })
  fieldKey!: string

  @Field(() => InputDependencyValue, {
    description:
      'The value `fieldKey` must hold for this field to apply. When it does not, the field is neither shown nor submitted.',
  })
  equals!: InputDependencyValueUnion
}
