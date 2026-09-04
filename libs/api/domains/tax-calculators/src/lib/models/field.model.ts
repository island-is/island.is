import { Field, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorFieldInputType } from './enums'
import { FieldDependency } from './fieldDependency.model'

@ObjectType('TaxCalculatorField')
export class CalculatorField {
  @Field({
    description:
      "Stable identifier for the input, as RSK names it. This is what a section field's `key` in the Contentful `configJson` must match.",
  })
  key!: string

  @Field(() => TaxCalculatorFieldInputType, {
    description:
      'Which kind of control the consumer should render, and how to format its value. See the enum members for what each one means.',
  })
  inputType!: TaxCalculatorFieldInputType

  @Field({
    description:
      'Whether RSK rejects the calculation when this field is absent.',
  })
  required!: boolean

  @Field(() => [String], {
    nullable: true,
    description:
      'Permitted values, set only when `inputType` is ENUM. These are raw identifiers (e.g. `firstHalf`) and carry no display text.',
  })
  options?: string[]

  @Field(() => FieldDependency, {
    nullable: true,
    description:
      'Set when the field is only part of the input contract under a condition. Absent means the field always applies.',
  })
  dependsOn?: FieldDependency
}
