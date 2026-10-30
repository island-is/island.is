import { Field, ObjectType } from '@nestjs/graphql'

import { OutputField } from './outputField.model'
import { OutputScalarField } from './outputScalarField.model'

@ObjectType('TaxCalculatorArrayOutputField', {
  implements: () => OutputField,
})
export class ArrayOutputField extends OutputField {
  @Field(() => [OutputScalarField], {
    description: 'Fields in each array row.',
  })
  itemFields!: OutputScalarField[]
}
