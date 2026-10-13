import { InterfaceType } from '@nestjs/graphql'

import { OutputField, resolveOutputField } from './outputField.model'

@InterfaceType('TaxCalculatorOutputScalarField', {
  description: 'An output field with a single value.',
  implements: () => OutputField,
  resolveType: resolveOutputField,
})
export abstract class OutputScalarField extends OutputField {}
