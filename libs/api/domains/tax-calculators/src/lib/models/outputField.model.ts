import { Field, InterfaceType, ObjectType } from '@nestjs/graphql'

import {
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from './enums'

export type ScalarOutputFieldType = Exclude<
  TaxCalculatorOutputFieldType,
  TaxCalculatorOutputFieldType.ARRAY
>

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

@InterfaceType('TaxCalculatorOutputField', {
  description:
    'One value a calculator returns. Carries no display text or layout.',
  resolveType: resolveOutputField,
})
export abstract class OutputField {
  @Field({
    description: 'Stable identifier for the output.',
  })
  key!: string

  @Field(() => TaxCalculatorOutputFieldType, {
    description: 'What kind of value this output carries.',
  })
  type!: TaxCalculatorOutputFieldType
}

@InterfaceType('TaxCalculatorOutputScalarField', {
  description:
    'An output field carrying a single value rather than a repeating group.',
  implements: () => OutputField,
  resolveType: resolveOutputField,
})
export abstract class OutputScalarField extends OutputField {}

@ObjectType('TaxCalculatorNumberOutputField', {
  implements: () => OutputScalarField,
})
export class NumberOutputField extends OutputScalarField {
  @Field(() => TaxCalculatorOutputFieldSemantic, {
    nullable: true,
    description: 'What this number means, and how to format it.',
  })
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
    description: 'The scalar fields present on each item in this array.',
  })
  itemFields!: OutputScalarField[]
}
