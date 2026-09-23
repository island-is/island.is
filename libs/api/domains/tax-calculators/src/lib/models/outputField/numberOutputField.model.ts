import { Field, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorOutputFieldSemantic } from '../enums'
import { OutputScalarField } from './outputScalarField.model'

@ObjectType('TaxCalculatorNumberOutputField', {
  implements: () => OutputScalarField,
})
export class NumberOutputField extends OutputScalarField {
  @Field(() => TaxCalculatorOutputFieldSemantic, { nullable: true })
  semantic?: TaxCalculatorOutputFieldSemantic
}
