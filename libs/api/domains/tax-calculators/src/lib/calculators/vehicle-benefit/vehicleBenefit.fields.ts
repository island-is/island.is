import { TaxCalculatorFieldKind } from '../../models/enums'
import {
  FieldDefinition,
  MAX_SANE_NUMBER_VALUE,
  parseBoolean,
  parseNumber,
} from '../../utils/parsing'

export const vehicleBenefitFields: FieldDefinition[] = [
  {
    key: 'isElectric',
    rawKey: 'rafbill',
    label: 'Eldsneyti',
    kind: TaxCalculatorFieldKind.SELECT,
    required: true,
    options: [
      { value: 'false', label: 'Bensín/dísel/tvinnbíll' },
      { value: 'true', label: 'Rafbíll/vetni/metan' },
    ],
    parse: parseBoolean,
  },
  {
    key: 'purchaseYear',
    rawKey: 'kaupar',
    label: 'Kaupár',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: true,
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'purchasePrice',
    rawKey: 'kaupverd',
    label: 'Kaupverð',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: true,
    unit: 'ISK',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'employeePaysRunningCosts',
    rawKey: 'starfsmadurGreidirRekstrarkostnad',
    label: 'Starfsmaður greiðir allan rekstrarkostnað',
    kind: TaxCalculatorFieldKind.CHECKBOX,
    required: false,
    parse: parseBoolean,
  },
  {
    key: 'employeePaysCharging',
    rawKey: 'starfsmadurGreidirHledslu',
    label: 'Starfsmaður hleður rafbíl á sinn kostnað',
    kind: TaxCalculatorFieldKind.CHECKBOX,
    required: false,
    parse: parseBoolean,
  },
]
