import { Field, ObjectType } from '@nestjs/graphql'

import { OutputField } from './outputField.model'
import { OutputScalarField } from './outputScalarField.model'

@ObjectType('TaxCalculatorObjectOutputField', {
  implements: () => OutputField,
})
export class ObjectOutputField extends OutputField {
  @Field(() => [OutputScalarField], {
    description: 'Fields in the row.',
  })
  itemFields!: OutputScalarField[]
}
