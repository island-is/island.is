import { TaxCalculatorFieldKind } from '../../models/enums'
import {
  FieldDefinition,
  MAX_SANE_NUMBER_VALUE,
  parseBoolean,
  parseDate,
  parseNumber,
  parseString,
} from '../../utils/parsing'
import { currentYearIncomeYearOptions } from '../../utils/fieldOptions'

export const vehicleTaxFields: FieldDefinition[] = [
  {
    key: 'year',
    rawKey: 'ar',
    label: 'Ár',
    kind: TaxCalculatorFieldKind.SELECT,
    required: true,
    options: currentYearIncomeYearOptions,
    parse: parseNumber,
  },
  {
    key: 'licensePlate',
    rawKey: 'bilnumer',
    label: 'Bílnúmer',
    kind: TaxCalculatorFieldKind.TEXT,
    required: true,
    parse: parseString,
  },
  {
    key: 'period',
    rawKey: 'gjaldtimabil',
    label: 'Tímabil',
    kind: TaxCalculatorFieldKind.SELECT,
    required: true,
    options: [
      { value: 'false', label: '1. janúar - 30. júní' },
      { value: 'true', label: '1. júlí - 31. desember' },
    ],
    parse: parseBoolean,
  },
  {
    // Only used when a vehicle changed owners mid-period; the UI gates this
    // behind a "Skipta upp tímabilinu" toggle section, not a visibleWhen
    // condition on another field's value.
    key: 'periodSplitDate',
    rawKey: 'gjaldskipting',
    label: 'Skiptidagur (ÁÁÁÁ-MM-DD)',
    kind: TaxCalculatorFieldKind.TEXT,
    required: false,
    // The real query type declares this as a `Date`, not a `string`.
    parse: parseDate,
  },
  {
    // UI-only switch: lets the viewer enter weight/emissions manually
    // instead of looking them up by license plate. getVehicleTax's query has
    // no params for manual weight/CO2 -- see manualCurbWeight etc. below --
    // so this and its dependent fields are currently ignored server-side
    // until the API supports submitting them.
    key: 'manualWeightEntry',
    rawKey: 'manualWeightEntry',
    label: 'Slá inn þyngd og losun',
    kind: TaxCalculatorFieldKind.BOOLEAN,
    required: false,
    parse: parseBoolean,
  },
  {
    key: 'manualCurbWeight',
    rawKey: 'eiginthyngd',
    label: 'Eigin þyngd',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'kg',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'manualNedcValue',
    rawKey: 'nedc',
    label: 'NEDC gildi',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'g/km CO2',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'manualWltpValue',
    rawKey: 'wltp',
    label: 'WLTP gildi',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'g/km CO2',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
]
