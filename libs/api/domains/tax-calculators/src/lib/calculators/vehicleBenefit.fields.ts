import { TaxCalculatorFieldKind } from '../models/enums'
import {
  FieldDefinition,
  MAX_SANE_NUMBER_VALUE,
} from '../utils/fieldDefinition'

export const vehicleBenefitFields: FieldDefinition[] = [
  {
    key: 'isElectric',
    label: 'Eldsneyti',
    kind: TaxCalculatorFieldKind.SELECT,
    required: true,
    options: [
      { value: 'false', label: 'Bensín/dísel/tvinnbíll' },
      { value: 'true', label: 'Rafbíll/vetni/metan' },
    ],
  },
  {
    key: 'purchaseYear',
    label: 'Kaupár',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: true,
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
  },
  {
    key: 'purchasePrice',
    label: 'Kaupverð',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: true,
    unit: 'ISK',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
  },
  {
    key: 'employeePaysRunningCosts',
    label: 'Starfsmaður greiðir allan rekstrarkostnað',
    kind: TaxCalculatorFieldKind.CHECKBOX,
    required: false,
  },
  {
    key: 'employeePaysCharging',
    label: 'Starfsmaður hleður rafbíl á sinn kostnað',
    kind: TaxCalculatorFieldKind.CHECKBOX,
    required: false,
  },
]
