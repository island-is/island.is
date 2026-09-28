import { ObjectType } from '@nestjs/graphql'

import { OutputScalarField } from './outputScalarField.model'

@ObjectType('TaxCalculatorStringOutputField', {
  implements: () => OutputScalarField,
})
export class StringOutputField extends OutputScalarField {}
