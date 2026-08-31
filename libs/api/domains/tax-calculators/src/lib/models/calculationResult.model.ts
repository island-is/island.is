import { Field, ObjectType } from '@nestjs/graphql'
import { CalculatorResultRow } from './resultRow.model'

@ObjectType('TaxCalculatorCalculationResult')
export class CalculatorCalculationResult {
  @Field(() => [CalculatorResultRow], {
    description:
      'Every normalized value the calculator produced, unfiltered. The CMS-authored result config decides which of these are actually rendered and how.',
  })
  values!: CalculatorResultRow[]
}
