import { Field, InputType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'

import { TaxCalculatorType } from '@island.is/tax-calculators'

import { InputFieldValue } from './inputFieldValue.model'

@InputType('TaxCalculatorCalculateInput')
export class CalculateInput {
  /* Registered with GraphQL by libs/cms/src/lib/models/calculator.model.ts --
   * this module must never call registerEnumType for it. */
  @Field(() => TaxCalculatorType, {
    description: 'Which calculator to run.',
  })
  type!: TaxCalculatorType

  @Field(() => [InputFieldValue], {
    description:
      'The submitted values, keyed by input field. Order carries no meaning. Fields whose `dependsOn` condition these values do not meet must not be submitted, and may be empty when the calculator requires nothing.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InputFieldValue)
  values!: InputFieldValue[]
}
