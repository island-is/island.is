import { Field, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorType } from '@island.is/tax-calculators'

import { InputField } from './inputField.model'
import { OutputField } from './outputField.model'

@ObjectType()
export class TaxCalculator {
  @Field(() => TaxCalculatorType)
  type!: TaxCalculatorType

  @Field(() => [InputField], {
    description:
      'Input fields accepted by this calculator. Order is insignificant; keys identify fields.',
  })
  inputFields!: InputField[]

  @Field(() => [OutputField], {
    description:
      'Output fields produced by this calculator. Order is insignificant; keys identify fields.',
  })
  outputFields!: OutputField[]
}
