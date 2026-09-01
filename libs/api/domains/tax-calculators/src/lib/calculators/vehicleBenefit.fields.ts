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
    // A year has a real upper bound, so MAX_SANE_NUMBER_VALUE (the guard for
    // fields with none) would be the wrong tool here.
    min: 1900,
    max: new Date().getFullYear(),
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
