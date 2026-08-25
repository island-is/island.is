import { TaxCalculatorFieldKind } from '../../models/enums'
import {
  FieldDefinition,
  MAX_SANE_NUMBER_VALUE,
  parseNumber,
} from '../../utils/parsing'
import { currentYearIncomeYearOptions } from '../../utils/fieldOptions'

export const vehicleDepreciationFields: FieldDefinition[] = [
  {
    key: 'purchasePrice',
    rawKey: 'verd',
    label: 'Kaupverð',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: true,
    unit: 'ISK',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'purchaseMonth',
    rawKey: 'kaupmanudur',
    label: 'Kaupmánuður',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: true,
    min: 1,
    max: 12,
    parse: parseNumber,
  },
  {
    key: 'purchaseYear',
    rawKey: 'kaupar',
    label: 'Kaupár',
    kind: TaxCalculatorFieldKind.SELECT,
    required: true,
    options: currentYearIncomeYearOptions,
    parse: parseNumber,
  },
  {
    // "koma" (entry into use) -- the vehicle's registration date, which the
    // Icelandic depreciation schedule is based on, not the purchase date.
    key: 'registrationMonth',
    rawKey: 'komumanudur',
    label: 'Skráningarmánuður',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: true,
    min: 1,
    max: 12,
    parse: parseNumber,
  },
  {
    key: 'registrationYear',
    rawKey: 'komuar',
    label: 'Skráningarár',
    kind: TaxCalculatorFieldKind.SELECT,
    required: true,
    options: currentYearIncomeYearOptions,
    parse: parseNumber,
  },
]
