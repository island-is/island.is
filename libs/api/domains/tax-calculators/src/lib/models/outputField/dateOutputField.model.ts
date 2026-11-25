import { ObjectType } from '@nestjs/graphql'

import { OutputScalarField } from './outputScalarField.model'

@ObjectType('TaxCalculatorDateOutputField', {
  implements: () => OutputScalarField,
})
export class DateOutputField extends OutputScalarField {}
