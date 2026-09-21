import { createUnionType } from '@nestjs/graphql'

import { BooleanInputDependencyValue } from './booleanInputDependencyValue.model'
import { NumberInputDependencyValue } from './numberInputDependencyValue.model'
import { StringInputDependencyValue } from './stringInputDependencyValue.model'

export type InputDependencyValueUnion =
  | BooleanInputDependencyValue
  | StringInputDependencyValue
  | NumberInputDependencyValue

/* Discriminated on `typeof value.value`, not on which key is present: all three
 * members are structurally `{ value }`, so the `'field' in value` style used by
 * other unions in this repo cannot tell them apart here. */
export const InputDependencyValue = createUnionType({
  name: 'TaxCalculatorInputDependencyValue',
  description:
    'The value a dependency compares against. Read `__typename` to learn which scalar it carries.',
  types: () =>
    [
      BooleanInputDependencyValue,
      StringInputDependencyValue,
      NumberInputDependencyValue,
    ] as const,
  resolveType: (value: InputDependencyValueUnion) => {
    switch (typeof value.value) {
      case 'boolean':
        return BooleanInputDependencyValue
      case 'string':
        return StringInputDependencyValue
      case 'number':
        return NumberInputDependencyValue
      default:
        return null
    }
  },
})
