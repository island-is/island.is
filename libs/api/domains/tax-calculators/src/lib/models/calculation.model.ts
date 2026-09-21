import { Field, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorType } from '@island.is/tax-calculators'

import { OutputFieldValue } from './outputFieldValue.model'

@ObjectType('TaxCalculatorCalculation')
export class Calculation {
  @Field(() => TaxCalculatorType, {
    description:
      'Echoes the calculator that was run, so a cached or batched result stays identifiable without tracking the argument alongside it.',
  })
  type!: TaxCalculatorType

  @Field(() => [OutputFieldValue], {
    description:
      'The results, keyed by output field. Order is deterministic but carries no meaning -- rendering order is CMS-authored. Keys RSK returned no value for are omitted, so this is not guaranteed to cover every field the metadata contract publishes.',
  })
  values!: OutputFieldValue[]
}
