import { Field, InterfaceType, ObjectType } from '@nestjs/graphql'

import {
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from './enums'

export type ScalarOutputFieldType = Exclude<
  TaxCalculatorOutputFieldType,
  TaxCalculatorOutputFieldType.ARRAY
>

// Co-located implementors avoid circular module initialization.
const resolveOutputField = (value: OutputField) => {
  switch (value.type) {
    case TaxCalculatorOutputFieldType.NUMBER:
      return NumberOutputField
    case TaxCalculatorOutputFieldType.STRING:
      return StringOutputField
    case TaxCalculatorOutputFieldType.BOOLEAN:
      return BooleanOutputField
    case TaxCalculatorOutputFieldType.DATE:
      return DateOutputField
    case TaxCalculatorOutputFieldType.ARRAY:
      return ArrayOutputField
    default: {
      const unhandled: never = value.type
      return unhandled
    }
  }
}

@InterfaceType('TaxCalculatorOutputField', { resolveType: resolveOutputField })
export abstract class OutputField {
  @Field()
  key!: string

  @Field(() => TaxCalculatorOutputFieldType)
  type!: TaxCalculatorOutputFieldType
}

@InterfaceType('TaxCalculatorOutputScalarField', {
  description: 'An output field with a single value.',
  implements: () => OutputField,
  resolveType: resolveOutputField,
})
export abstract class OutputScalarField extends OutputField {}

@ObjectType('TaxCalculatorNumberOutputField', {
  implements: () => OutputScalarField,
})
export class NumberOutputField extends OutputScalarField {
  @Field(() => TaxCalculatorOutputFieldSemantic, { nullable: true })
  semantic?: TaxCalculatorOutputFieldSemantic
}

@ObjectType('TaxCalculatorStringOutputField', {
  implements: () => OutputScalarField,
})
export class StringOutputField extends OutputScalarField {}

@ObjectType('TaxCalculatorBooleanOutputField', {
  implements: () => OutputScalarField,
})
export class BooleanOutputField extends OutputScalarField {}

@ObjectType('TaxCalculatorDateOutputField', {
  implements: () => OutputScalarField,
})
export class DateOutputField extends OutputScalarField {}

@ObjectType('TaxCalculatorArrayOutputField', {
  implements: () => OutputField,
})
export class ArrayOutputField extends OutputField {
  @Field(() => [OutputScalarField], {
    description: 'Fields in each array row.',
  })
  itemFields!: OutputScalarField[]
}
