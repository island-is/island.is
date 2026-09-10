import { Field, InterfaceType, ObjectType } from '@nestjs/graphql'

import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from './enums'
import { InputFieldDependency } from './inputFieldDependency.model'
import { InputFieldOption } from './inputFieldOption.model'

/* The interface and its five implementors share this file deliberately, which
 * is what lets the implementors use `extends` and inherit the four shared
 * fields -- and their descriptions -- instead of restating them five times.
 *
 * `extends` is evaluated at class-definition time, so it only works while the
 * interface and its implementors are in the same module: a custom resolveType
 * forces the interface to reference the concrete classes, and across separate
 * files that cycle makes module load order decide whether the library throws
 * `TypeError: Class extends value undefined`. Referencing them from the same
 * file is safe because resolveType's body runs long after evaluation.
 * `auth/src/lib/models/delegation.model.ts` is the precedent.
 *
 * `value` is annotated explicitly because NestJS types the resolveType
 * parameter loosely; without it the exhaustive `never` below is dead code
 * rather than a compile-time guarantee that every member of
 * TaxCalculatorInputFieldType has a concrete type. */
@InterfaceType('TaxCalculatorInputField', {
  description:
    'One input a calculator accepts. Carries no display text: labels, placeholders, ordering and layout are editor-authored per placement in the Contentful `configJson`, which joins to this on `key`.',
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
  @Field({
    description:
      "Stable identifier for the input, as RSK names it. This is what a section field's `key` in the Contentful `configJson` must match.",
  })
  key!: string

  @Field(() => TaxCalculatorInputFieldType, {
    description:
      'Which kind of control the consumer should render. Redundant with `__typename`, and kept for consumers that would rather switch on an enum than on a type name.',
  })
  type!: TaxCalculatorInputFieldType

  @Field({
    description:
      'Whether RSK rejects the calculation when this field is absent.',
  })
  required!: boolean

  @Field(() => InputFieldDependency, {
    nullable: true,
    description:
      'Set when the field is only part of the input contract under a condition. Absent means the field always applies. A consumer must neither render nor submit a field whose dependency is unmet.',
  })
  dependsOn?: InputFieldDependency
}

@ObjectType('TaxCalculatorNumberInputField', { implements: () => InputField })
export class NumberInputField extends InputField {
  @Field(() => TaxCalculatorInputFieldSemantic, {
    nullable: true,
    description:
      'What this number means, and how to format it. Absent when the client annotates no semantic for the field.',
  })
  semantic?: TaxCalculatorInputFieldSemantic
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
    description:
      'The permitted values. Never empty, and only ever present on a select field. These are raw identifiers and carry no display text.',
  })
  options!: InputFieldOption[]
}
