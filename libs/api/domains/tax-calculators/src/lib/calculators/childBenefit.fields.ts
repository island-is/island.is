import { TaxCalculatorFieldKind } from '../models/enums'
import {
  FieldDefinition,
  MAX_SANE_NUMBER_VALUE,
} from '../utils/fieldDefinition'
import {
  buildCountOptions,
  previousYearIncomeYearOptions,
} from '../utils/fieldOptions'

export const childBenefitFields: FieldDefinition[] = [
  {
    key: 'marriedOrCohabiting',
    label: 'Hjúskaparstaða',
    kind: TaxCalculatorFieldKind.SELECT,
    required: true,
    options: [
      { value: 'true', label: 'Hjón / Í sambúð' },
      { value: 'false', label: 'Einhleypingur' },
    ],
  },
  {
    key: 'incomeYear',
    label: 'Tekjuár',
    kind: TaxCalculatorFieldKind.SELECT,
    required: true,
    options: previousYearIncomeYearOptions,
  },
  {
    key: 'incomeBase',
    label: 'Tekjustofn ársins',
    kind: TaxCalculatorFieldKind.NUMBER,
    required: true,
    unit: 'ISK',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
  },
  {
    key: 'numberOfChildren',
    label: 'Börn alls',
    kind: TaxCalculatorFieldKind.SELECT,
    required: true,
    options: buildCountOptions(10),
  },
  {
    key: 'numberOfChildrenUnder7',
    label: 'Börn undir 7 ára',
    kind: TaxCalculatorFieldKind.SELECT,
    required: true,
    options: buildCountOptions(10),
  },
  {
    key: 'splitCustody',
    label: 'Er um að ræða skipta búsetu?',
    kind: TaxCalculatorFieldKind.BOOLEAN,
    required: true,
  },
  {
    key: 'splitCustodyChildrenOver7',
    label: 'Börn alls (skipt forsjá)',
    kind: TaxCalculatorFieldKind.SELECT,
    required: false,
    options: buildCountOptions(10),
  },
  {
    key: 'splitCustodyChildrenUnder7',
    label: 'Börn undir 7 ára (skipt forsjá)',
    kind: TaxCalculatorFieldKind.SELECT,
    required: false,
    options: buildCountOptions(10),
  },
]
