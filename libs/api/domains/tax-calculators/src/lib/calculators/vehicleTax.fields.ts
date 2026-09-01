import { TaxCalculatorFieldKind } from '../models/enums'
import {
  FieldDefinition,
  MAX_SANE_NUMBER_VALUE,
} from '../utils/fieldDefinition'
import { currentYearIncomeYearOptions } from '../utils/fieldOptions'

export const vehicleTaxFields: FieldDefinition[] = [
  {
    key: 'year',
    label: 'Ár',
    kind: TaxCalculatorFieldKind.SELECT,
    required: true,
    options: currentYearIncomeYearOptions,
  },
  {
    key: 'licensePlate',
    label: 'Bílnúmer',
    kind: TaxCalculatorFieldKind.TEXT,
    required: true,
  },
  {
    key: 'period',
    label: 'Tímabil',
    kind: TaxCalculatorFieldKind.SELECT,
    required: true,
    options: [
      { value: 'false', label: '1. janúar - 30. júní' },
      { value: 'true', label: '1. júlí - 31. desember' },
    ],
  },
  {
    // Only used when a vehicle changed owners mid-period; the UI gates this
    // behind a "Skipta upp tímabilinu" toggle section, authored in
    // Contentful -- the backend has no conditional opinion on it.
    key: 'periodSplitDate',
    label: 'Skiptidagur',
    kind: TaxCalculatorFieldKind.DATE,
    required: false,
    // The real query type declares this as a `Date`, not a `string`.
  },
  {
    // UI-only switch: lets the viewer enter weight/emissions manually
    // instead of looking them up by license plate. getVehicleTax's query has
    // no params for manual weight/CO2 -- see manualCurbWeight etc. below --
    // so this and its dependent fields are currently ignored server-side
    // until the API supports submitting them.
    key: 'manualWeightEntry',
    label: 'Slá inn þyngd og losun',
    kind: TaxCalculatorFieldKind.BOOLEAN,
    required: false,
  },
  {
    key: 'manualCurbWeight',
    label: 'Eigin þyngd',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'kg',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
  },
  {
    key: 'manualNedcValue',
    label: 'NEDC gildi',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'g/km CO2',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
  },
  {
    key: 'manualWltpValue',
    label: 'WLTP gildi',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'g/km CO2',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
  },
]
