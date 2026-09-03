import type { InputProp } from '@island.is/clients/rsk/calculators'

import { TaxCalculatorFieldDataType } from './models/enums'
import { CalculatorField } from './models/field.model'
import { FieldDependency } from './models/fieldDependency.model'

const DATA_TYPE_BY_INPUT_PROP_TYPE: Record<
  InputProp['dataType'],
  TaxCalculatorFieldDataType
> = {
  number: TaxCalculatorFieldDataType.NUMBER,
  string: TaxCalculatorFieldDataType.STRING,
  boolean: TaxCalculatorFieldDataType.BOOLEAN,
  date: TaxCalculatorFieldDataType.DATE,
  enum: TaxCalculatorFieldDataType.ENUM,
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
  dataType: DATA_TYPE_BY_INPUT_PROP_TYPE[prop.dataType],
  required: prop.required,
  options: prop.options ?? undefined,
  dependsOn: dependency ?? undefined,
})
