import { Field, Float, InterfaceType, ObjectType } from '@nestjs/graphql'

import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from './enums'
import { InputFieldDependency } from './inputFieldDependency.model'
import { InputFieldOption } from './inputFieldOption.model'

/* Co-located inheritance avoids circular module initialization. `value` is
 * explicitly typed so the exhaustive switch remains checked. */
@InterfaceType('TaxCalculatorInputField', {
  resolveType(value: InputField) {
    switch (value.type) {
      case TaxCalculatorInputFieldType.NUMBER:
        return NumberInputField
      case TaxCalculatorInputFieldType.STRING:
        return StringInputField
      case TaxCalculatorInputFieldType.BOOLEAN:
        return BooleanInputField
      case TaxCalculatorInputFieldType.DATE:
        return DateInputField
      case TaxCalculatorInputFieldType.SELECT:
        return SelectInputField
      default: {
        const unhandled: never = value.type
        return unhandled
      }
    }
  },
})
export abstract class InputField {
  @Field()
  key!: string

  @Field(() => TaxCalculatorInputFieldType)
  type!: TaxCalculatorInputFieldType

  @Field()
  required!: boolean

  @Field(() => InputFieldDependency, {
    nullable: true,
    description: 'Condition under which this field applies.',
  })
  dependsOn?: InputFieldDependency
}

@ObjectType('TaxCalculatorNumberInputField', { implements: () => InputField })
export class NumberInputField extends InputField {
  @Field(() => TaxCalculatorInputFieldSemantic, { nullable: true })
  semantic?: TaxCalculatorInputFieldSemantic

  @Field(() => Float, { nullable: true })
  min?: number

  @Field(() => Float, { nullable: true })
  max?: number
}

@ObjectType('TaxCalculatorStringInputField', { implements: () => InputField })
export class StringInputField extends InputField {}

@ObjectType('TaxCalculatorBooleanInputField', { implements: () => InputField })
export class BooleanInputField extends InputField {}

@ObjectType('TaxCalculatorDateInputField', { implements: () => InputField })
export class DateInputField extends InputField {}

@ObjectType('TaxCalculatorSelectInputField', { implements: () => InputField })
export class SelectInputField extends InputField {
  @Field(() => [InputFieldOption], {
    description: 'Permitted values for this select field.',
  })
  options!: InputFieldOption[]
}
