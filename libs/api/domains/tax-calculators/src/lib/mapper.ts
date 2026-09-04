import type { InputProp } from '@island.is/clients/rsk/calculators'

import { TaxCalculatorFieldInputType } from './models/enums'
import { CalculatorField } from './models/field.model'
import { FieldDependency } from './models/fieldDependency.model'

const INPUT_TYPE_BY_SEMANTIC: Record<
  InputProp['inputType'],
  TaxCalculatorFieldInputType
> = {
  currency: TaxCalculatorFieldInputType.CURRENCY,
  percentage: TaxCalculatorFieldInputType.PERCENTAGE,
  year: TaxCalculatorFieldInputType.YEAR,
  month: TaxCalculatorFieldInputType.MONTH,
  count: TaxCalculatorFieldInputType.COUNT,
  number: TaxCalculatorFieldInputType.NUMBER,
  string: TaxCalculatorFieldInputType.STRING,
  boolean: TaxCalculatorFieldInputType.BOOLEAN,
  date: TaxCalculatorFieldInputType.DATE,
  enum: TaxCalculatorFieldInputType.ENUM,
}

/* Deliberately pure: `InputProp.dependsOn.value` is `unknown`, and narrowing
 * it needs both a logger and the calculator key for a usable warning, neither
 * of which belong here. TaxCalculatorsService resolves the dependency and
 * passes the narrowed result in. */
export const mapInputPropToField = (
  prop: InputProp,
  dependency?: FieldDependency,
): CalculatorField => ({
  key: prop.name,
  inputType: INPUT_TYPE_BY_SEMANTIC[prop.inputType],
  required: prop.required,
  options: prop.options ?? undefined,
  dependsOn: dependency ?? undefined,
})
