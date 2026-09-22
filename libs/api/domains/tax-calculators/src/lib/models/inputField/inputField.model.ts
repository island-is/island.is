import { Field, InterfaceType } from '@nestjs/graphql'

import { TaxCalculatorInputFieldType } from '../enums'
import { InputFieldDependency } from '../inputFieldDependency.model'

@InterfaceType('TaxCalculatorInputField', {
  resolveType(value: InputField) {
    switch (value.type) {
      case TaxCalculatorInputFieldType.NUMBER:
        return 'TaxCalculatorNumberInputField'
      case TaxCalculatorInputFieldType.STRING:
        return 'TaxCalculatorStringInputField'
      case TaxCalculatorInputFieldType.BOOLEAN:
        return 'TaxCalculatorBooleanInputField'
      case TaxCalculatorInputFieldType.DATE:
        return 'TaxCalculatorDateInputField'
      case TaxCalculatorInputFieldType.SELECT:
        return 'TaxCalculatorSelectInputField'
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
