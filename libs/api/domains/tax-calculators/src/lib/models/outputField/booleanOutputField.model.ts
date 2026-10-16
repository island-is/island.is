import { ObjectType } from '@nestjs/graphql'

import { OutputScalarField } from './outputScalarField.model'

@ObjectType('TaxCalculatorBooleanOutputField', {
  implements: () => OutputScalarField,
})
export class BooleanOutputField extends OutputScalarField {}
