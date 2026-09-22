import { Field, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorType } from '@island.is/tax-calculators'

import { OutputFieldValue } from './outputFieldValue.model'

@ObjectType('TaxCalculatorCalculation')
export class Calculation {
  @Field(() => TaxCalculatorType)
  type!: TaxCalculatorType

  @Field(() => [OutputFieldValue], {
    description:
      'Calculated values keyed by output-field key. Outputs without a value are omitted.',
  })
  values!: OutputFieldValue[]
}
