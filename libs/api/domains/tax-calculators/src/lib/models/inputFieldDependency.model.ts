import { Field, ObjectType } from '@nestjs/graphql'

import {
  InputDependencyValue,
  type InputDependencyValueUnion,
} from './inputDependencyValue.model'

@ObjectType('TaxCalculatorInputFieldDependency')
export class InputFieldDependency {
  @Field({
    description: 'Key of the field this condition depends on.',
  })
  fieldKey!: string

  @Field(() => InputDependencyValue, {
    description: 'Value `fieldKey` must equal for this field to apply.',
  })
  equals!: InputDependencyValueUnion
}
