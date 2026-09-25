import type { CalculatorLocalizedText } from '@island.is/tax-calculators'

import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from '../../../../graphql/schema'
import type { InputContractField, InputFieldContract } from '../contract'

type Control =
  | { kind: 'choice' }
  | { kind: 'text'; unit?: CalculatorLocalizedText }

const controlByType: Record<TaxCalculatorInputFieldType, Control> = {
  [TaxCalculatorInputFieldType.Boolean]: { kind: 'choice' },
  [TaxCalculatorInputFieldType.Select]: { kind: 'choice' },
  [TaxCalculatorInputFieldType.Date]: {
    kind: 'text',
    unit: { is: 'dagsetning', en: 'date' },
  },
  [TaxCalculatorInputFieldType.Number]: { kind: 'text' },
  [TaxCalculatorInputFieldType.String]: { kind: 'text' },
}

const controlBySemantic: Partial<
  Record<TaxCalculatorInputFieldSemantic, Control>
> = {
  [TaxCalculatorInputFieldSemantic.Currency]: {
    kind: 'text',
    unit: { is: 'krónur', en: 'ISK' },
  },
  [TaxCalculatorInputFieldSemantic.Percentage]: {
    kind: 'text',
    unit: { is: '%', en: '%' },
  },
  [TaxCalculatorInputFieldSemantic.Count]: {
    kind: 'text',
    unit: { is: 'fjöldi', en: 'count' },
  },
  [TaxCalculatorInputFieldSemantic.Year]: { kind: 'choice' },
  [TaxCalculatorInputFieldSemantic.Month]: { kind: 'choice' },
}

export const controlForField = (field: InputContractField | undefined) => {
  if (!field) return undefined
  return (
    (field.semantic ? controlBySemantic[field.semantic] : undefined) ??
    controlByType[field.type]
  )
}

export const placeholderFor = (key: string, contract: InputFieldContract) => {
  const control = controlForField(contract.get(key))
  const unit = control?.kind === 'text' ? control.unit : undefined
  return unit ? { ...unit } : undefined
}

export const isSameText = (
  a: CalculatorLocalizedText | undefined,
  b: CalculatorLocalizedText | undefined,
) => a?.is === b?.is && a?.en === b?.en
