import { Field, ObjectType } from '@nestjs/graphql'

import { TaxCalculatorType } from '@island.is/tax-calculators'

import { InputField } from './inputField.model'

@ObjectType()
export class TaxCalculator {
  /* TaxCalculatorType is declared in @island.is/tax-calculators and registered
   * with GraphQL by libs/cms/src/lib/models/calculator.model.ts, following
   * CustomPageUniqueIdentifier. This module must never call registerEnumType
   * for it -- registering the same enum twice throws. */
  @Field(() => TaxCalculatorType, {
    description:
      'Echoes the requested calculator, so a cached or batched result stays identifiable without tracking the argument alongside it.',
  })
  type!: TaxCalculatorType

  @Field(() => [InputField], {
    description:
      'Every input RSK accepts for this calculator. Order carries no meaning -- match fields by `key`, never by position. A field carrying `dependsOn` applies only under that condition.',
  })
  inputFields!: InputField[]
}
