import { BadRequestException } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import type {
  GetChildBenefitData,
  GetChildBenefitResponse,
  GetVehicleTaxData,
  GetVehicleTaxResponse,
  GetVehicleBenefitData,
  GetVehicleBenefitResponse,
  GetWithholdingTaxData,
  GetWithholdingTaxResponse,
} from '@island.is/clients/rsk/calculators'
import { RskCalculatorFieldKind, RskCalculatorType } from './models/enums'
import { CalculatorField } from './models/field.model'
import { CalculatorResultRow } from './models/resultRow.model'
import { CalculatorInputValue } from './dto/inputValue.input'

type StadgreidslaQuery = NonNullable<GetWithholdingTaxData['query']>
type BarnabaeturQuery = GetChildBenefitData['query']
type BifreidagjoldQuery = GetVehicleTaxData['query']
type BifreidahlunnindiQuery = GetVehicleBenefitData['query']
type CalculatorQuery =
  | StadgreidslaQuery
  | BarnabaeturQuery
  | BifreidagjoldQuery
  | BifreidahlunnindiQuery

const parseNumber = (raw: string, key: string): number => {
  const value = Number(raw)
  if (Number.isNaN(value)) {
    throw new BadRequestException(`Invalid number value for field "${key}"`)
  }
  return value
}

const parseBoolean = (raw: string, key: string): boolean => {
  if (raw === 'true') return true
  if (raw === 'false') return false
  throw new BadRequestException(`Invalid boolean value for field "${key}"`)
}

const parseString = (raw: string): string => raw

const parseDate = (raw: string, key: string): Date => {
  const value = new Date(raw)
  if (Number.isNaN(value.getTime())) {
    throw new BadRequestException(`Invalid date value for field "${key}"`)
  }
  return value
}

/**
 * The raw API expects several fields as a ratio between 0 and 1. We expose
 * these to the web client as a 0-100 percentage for better UX and convert
 * back to a ratio here.
 */
const parsePercentageToRatio = (raw: string, key: string): number =>
  parseNumber(raw, key) / 100

const buildYearOptions = (years: number[]) =>
  years.map((year) => ({ value: String(year), label: String(year) }))

const CURRENT_YEAR = new Date().getFullYear()

// The current year and the two years before it. `years[0]` becomes the
// field's default selection (see `CalculatorFieldInput` in the web slice,
// which defaults a SELECT field to its first option).
const currentYearIncomeYearOptions = buildYearOptions([
  CURRENT_YEAR,
  CURRENT_YEAR - 1,
  CURRENT_YEAR - 2,
])

// Child benefit is calculated from the previous year's income, so the
// previous year is the sensible default.
const previousYearIncomeYearOptions = buildYearOptions([
  CURRENT_YEAR - 1,
  CURRENT_YEAR,
  CURRENT_YEAR - 2,
])

// 32-bit signed int max. A generic overflow guard for NUMBER fields with no
// real business-defined upper bound -- not a business rule itself.
const MAX_SANE_NUMBER_VALUE = 2_147_483_647

const buildCountOptions = (max: number) =>
  Array.from({ length: max + 1 }, (_, count) => ({
    value: String(count),
    label: String(count),
  }))

interface FieldDefinition {
  key: string
  rawKey: string
  label: string
  kind: RskCalculatorFieldKind
  required: boolean
  unit?: string
  min?: number
  max?: number
  options?: { value: string; label: string }[]
  parse: (raw: string, key: string) => number | boolean | string | Date
}

const stadgreidslaFields: FieldDefinition[] = [
  {
    key: 'paymentFrequency',
    rawKey: 'launGreidast',
    label: 'Greiðslutíðni launa',
    kind: RskCalculatorFieldKind.SELECT,
    required: false,
    options: [
      { value: 'false', label: 'Vikulega' },
      { value: 'true', label: 'Mánaðarlega' },
    ],
    parse: parseBoolean,
  },
  {
    key: 'maritalStatus',
    rawKey: 'hjuskaparstada',
    label: 'Hjúskaparstaða',
    kind: RskCalculatorFieldKind.SELECT,
    required: false,
    options: [
      { value: '1', label: 'Einhleypingur' },
      { value: '2', label: 'Einstætt foreldri' },
      { value: '3', label: 'Hjón/Sambúð' },
    ],
    parse: parseNumber,
  },
  {
    key: 'incomeYear',
    rawKey: 'tekjuar',
    label: 'Tekjuár',
    kind: RskCalculatorFieldKind.SELECT,
    required: true,
    options: currentYearIncomeYearOptions,
    parse: parseNumber,
  },
  {
    key: 'payMonth',
    rawKey: 'launamanudur',
    label: 'Launamánuður',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    min: 1,
    max: 12,
    parse: parseNumber,
  },
  {
    key: 'salary',
    rawKey: 'laun',
    label: 'Heildarlaun mánaðar',
    kind: RskCalculatorFieldKind.NUMBER,
    required: true,
    unit: 'ISK',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'pensionFundRatio',
    rawKey: 'lifeyrissjodurHlutfall',
    label: 'Í lífeyrissjóð',
    kind: RskCalculatorFieldKind.SELECT,
    required: false,
    unit: '%',
    // 4% is the statutory minimum employee contribution to a pension fund.
    options: [{ value: '4', label: '4%' }],
    parse: parsePercentageToRatio,
  },
  {
    key: 'privatePensionRatio',
    rawKey: 'sereignHlutfall',
    label: 'Í séreignarsjóð',
    kind: RskCalculatorFieldKind.SELECT,
    required: false,
    unit: '%',
    // Voluntary private pension savings are commonly 0% (opt out), 2%, or 4%.
    options: [
      { value: '0', label: '0%' },
      { value: '2', label: '2%' },
      { value: '4', label: '4%' },
    ],
    parse: parsePercentageToRatio,
  },
  {
    key: 'taxCardUtilization',
    rawKey: 'nytingSkattkorts',
    label: 'Nýting eigin afsláttar',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: '%',
    min: 0,
    max: 100,
    parse: parsePercentageToRatio,
  },
  {
    key: 'spouseTaxCardUtilization',
    rawKey: 'nytingSkattkortsMaka',
    label: 'Nýting afsláttar maka',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: '%',
    min: 0,
    max: 100,
    parse: parsePercentageToRatio,
  },
  {
    key: 'accumulatedPersonalTaxCredit',
    rawKey: 'uppsafnadurPersonuafslattur',
    label: 'Uppsafnaður afsláttur',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'ISK',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'vacationPay',
    rawKey: 'orlof',
    label: 'Orlof',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'ISK',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'unionDues',
    rawKey: 'stettarfelag',
    label: 'Gjöld f. stéttarfélag',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'ISK',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'otherDeduction',
    rawKey: 'annad',
    label: 'Annar frádráttur',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'ISK',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'employerPensionMatchRatio',
    rawKey: 'motframlagLifeyrissjodur',
    label: 'Mótframlag í lífeyrissjóð',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: '%',
    min: 0,
    max: 100,
    parse: parsePercentageToRatio,
  },
  {
    key: 'vehicleAllowance',
    rawKey: 'okutaekjastyrkurUtan',
    label: 'Ökutækjastyrkur utan staðgreiðslu',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'ISK',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'seamenAccidentInsurancePremium',
    rawKey: 'idgjaldSlysatryggingSjomanna',
    label: 'Iðgjald slysatryggingar sjómanna',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'ISK',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
]

const barnabaeturFields: FieldDefinition[] = [
  {
    key: 'marriedOrCohabiting',
    rawKey: 'hjuskaparstada',
    label: 'Hjúskaparstaða',
    kind: RskCalculatorFieldKind.SELECT,
    required: true,
    options: [
      { value: 'true', label: 'Hjón / Í sambúð' },
      { value: 'false', label: 'Einhleypingur' },
    ],
    parse: parseBoolean,
  },
  {
    key: 'incomeYear',
    rawKey: 'tekjuar',
    label: 'Tekjuár',
    kind: RskCalculatorFieldKind.SELECT,
    required: true,
    options: previousYearIncomeYearOptions,
    parse: parseNumber,
  },
  {
    key: 'incomeBase',
    rawKey: 'tekjustofn',
    label: 'Tekjustofn ársins',
    kind: RskCalculatorFieldKind.NUMBER,
    required: true,
    unit: 'ISK',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'numberOfChildren',
    rawKey: 'fjoldiBarna',
    label: 'Börn alls',
    kind: RskCalculatorFieldKind.SELECT,
    required: true,
    options: buildCountOptions(10),
    parse: parseNumber,
  },
  {
    key: 'numberOfChildrenUnder7',
    rawKey: 'fjoldiBarnaUndir7ara',
    label: 'Börn undir 7 ára',
    kind: RskCalculatorFieldKind.SELECT,
    required: true,
    options: buildCountOptions(10),
    parse: parseNumber,
  },
  {
    key: 'splitCustody',
    rawKey: 'skiptBuseta',
    label: 'Er um að ræða skipta búsetu?',
    kind: RskCalculatorFieldKind.BOOLEAN,
    required: true,
    parse: parseBoolean,
  },
  {
    key: 'splitCustodyChildrenOver7',
    rawKey: 'skiptBornYfir7ara',
    label: 'Börn alls',
    kind: RskCalculatorFieldKind.SELECT,
    required: false,
    options: buildCountOptions(10),
    parse: parseNumber,
  },
  {
    key: 'splitCustodyChildrenUnder7',
    rawKey: 'skiptBornUndir7ara',
    label: 'Börn undir 7 ára',
    kind: RskCalculatorFieldKind.SELECT,
    required: false,
    options: buildCountOptions(10),
    parse: parseNumber,
  },
]

const vehicleTaxFields: FieldDefinition[] = [
  {
    key: 'year',
    rawKey: 'ar',
    label: 'Ár',
    kind: RskCalculatorFieldKind.SELECT,
    required: true,
    options: currentYearIncomeYearOptions,
    parse: parseNumber,
  },
  {
    key: 'licensePlate',
    rawKey: 'bilnumer',
    label: 'Bílnúmer',
    kind: RskCalculatorFieldKind.TEXT,
    required: true,
    parse: parseString,
  },
  {
    key: 'period',
    rawKey: 'gjaldtimabil',
    label: 'Tímabil',
    kind: RskCalculatorFieldKind.SELECT,
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
    kind: RskCalculatorFieldKind.TEXT,
    required: false,
    // The real query type declares this as a `Date`, not a `string`.
    parse: parseDate,
  },
  {
    // UI-only switch: lets the viewer enter weight/emissions manually
    // instead of looking them up by license plate. getApiBifreidagjold's
    // query has no params for manual weight/CO2 -- see manualCurbWeight
    // etc. below -- so this and its dependent fields are currently ignored
    // server-side until the API supports submitting them.
    key: 'manualWeightEntry',
    rawKey: 'manualWeightEntry',
    label: 'Slá inn þyngd og losun',
    kind: RskCalculatorFieldKind.BOOLEAN,
    required: false,
    parse: parseBoolean,
  },
  {
    key: 'manualCurbWeight',
    rawKey: 'eiginthyngd',
    label: 'Eigin þyngd',
    kind: RskCalculatorFieldKind.NUMBER,
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
    kind: RskCalculatorFieldKind.NUMBER,
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
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'g/km CO2',
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
]

const vehicleBenefitFields: FieldDefinition[] = [
  {
    key: 'isElectric',
    rawKey: 'rafbill',
    label: 'Eldsneyti',
    kind: RskCalculatorFieldKind.SELECT,
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
    kind: RskCalculatorFieldKind.NUMBER,
    required: true,
    min: 0,
    max: MAX_SANE_NUMBER_VALUE,
    parse: parseNumber,
  },
  {
    key: 'purchasePrice',
    rawKey: 'kaupverd',
    label: 'Kaupverð',
    kind: RskCalculatorFieldKind.NUMBER,
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
    kind: RskCalculatorFieldKind.CHECKBOX,
    required: false,
    parse: parseBoolean,
  },
  {
    key: 'employeePaysCharging',
    rawKey: 'starfsmadurGreidirHledslu',
    label: 'Starfsmaður hleður rafbíl á sinn kostnað',
    kind: RskCalculatorFieldKind.CHECKBOX,
    required: false,
    parse: parseBoolean,
  },
]

const fieldDefinitionsByType: Record<RskCalculatorType, FieldDefinition[]> = {
  [RskCalculatorType.WITHHOLDING_TAX_ON_WAGES]: stadgreidslaFields,
  [RskCalculatorType.CHILD_BENEFIT]: barnabaeturFields,
  [RskCalculatorType.VEHICLE_TAX]: vehicleTaxFields,
  [RskCalculatorType.VEHICLE_BENEFIT]: vehicleBenefitFields,
}

export const getCalculatorFields = (
  calculatorType: RskCalculatorType,
): CalculatorField[] =>
  fieldDefinitionsByType[calculatorType].map((definition) => {
    const field = new CalculatorField()
    field.key = definition.key
    field.label = definition.label
    field.kind = definition.kind
    field.required = definition.required
    field.unit = definition.unit
    field.min = definition.min
    field.max = definition.max
    field.options = definition.options
    return field
  })

/**
 * Builds the raw client query object from the generic key/value pairs
 * submitted by the web client, validating required fields and parsing
 * string values into the types the underlying client expects.
 */
export const buildCalculatorQuery = <TQuery extends CalculatorQuery>(
  calculatorType: RskCalculatorType,
  input: CalculatorInputValue[],
): TQuery => {
  const definitions = fieldDefinitionsByType[calculatorType]
  const valuesByKey = new Map(input.map((entry) => [entry.key, entry.value]))
  const query: Record<string, number | boolean | string | Date> = {}

  for (const definition of definitions) {
    const raw = valuesByKey.get(definition.key)
    // The web client always submits every field, so an optional field left
    // blank arrives as "" rather than being omitted -- treat both as "not
    // provided" rather than parsing an empty string.
    if (raw === undefined || raw === '') {
      if (definition.required) {
        throw new BadRequestException(
          `Missing required field "${definition.key}"`,
        )
      }
      continue
    }
    query[definition.rawKey as string] = definition.parse(raw, definition.key)
  }

  return query as TQuery
}

const buildRow = (
  key: string,
  label: string,
  value: number | bigint | string | null | undefined,
  options?: { unit?: string; group?: string; emphasis?: boolean },
): CalculatorResultRow | undefined => {
  if (value === null || value === undefined) {
    return undefined
  }
  const row = new CalculatorResultRow()
  row.key = key
  row.label = label
  row.value = String(value)
  row.unit = options?.unit
  row.group = options?.group
  row.emphasis = options?.emphasis
  return row
}

export const mapStadgreidslaResultToRows = (
  result: GetWithholdingTaxResponse | undefined,
): CalculatorResultRow[] => {
  if (!result) {
    throw new BadRequestException('No calculation result was returned')
  }

  const rows = [
    buildRow('monthlySalary', 'Mánaðarlaun', result.manadarlaun, {
      unit: 'ISK',
    }),
    buildRow(
      'pensionFundPercentageUsed',
      'Hlutfall í lífeyrissjóð',
      result.lifeyrisjodurProsenta,
      { unit: '%' },
    ),
    buildRow(
      'privatePensionPercentageUsed',
      'Hlutfall í séreignarsparnað',
      result.sereignProsenta,
      { unit: '%' },
    ),
    buildRow(
      'pensionFundContribution',
      'Framlag í lífeyrissjóð',
      result.lifeyrissjodur,
      { unit: 'ISK' },
    ),
    buildRow(
      'privatePensionContribution',
      'Framlag í séreignarsparnað',
      result.sereignarsjodur,
      { unit: 'ISK' },
    ),
    buildRow('totalDeductions', 'Frádráttur alls', result.fradratturAlls, {
      unit: 'ISK',
    }),
    buildRow('personalTaxCredit', 'Persónuafsláttur', result.personuafslattur, {
      unit: 'ISK',
    }),
    buildRow(
      'personalTaxCreditFromSpouse',
      'Persónuafsláttur frá maka',
      result.personuafslatturFraMaka,
      { unit: 'ISK' },
    ),
    buildRow('taxBase', 'Skattstofn', result.skattstofn, { unit: 'ISK' }),
    buildRow(
      'calculatedWithholdingTax',
      'Reiknuð staðgreiðsla',
      result.reiknudStadgreidsla,
      { unit: 'ISK' },
    ),
    buildRow(
      'paidWithholdingTax',
      'Greidd staðgreiðsla',
      result.greiddStadgreidsla,
      { unit: 'ISK' },
    ),
    buildRow('highIncomeTax', 'Hátekjuskattur', result.hatekjuskattur, {
      unit: 'ISK',
    }),
    buildRow('netPay', 'Útborguð laun', result.utborgudLaun, {
      unit: 'ISK',
      emphasis: true,
    }),
    buildRow(
      'accumulatedPersonalTaxCredit',
      'Uppsafnaður persónuafsláttur',
      result.uppsafnadurPersonuafslattur,
      { unit: 'ISK' },
    ),
    buildRow(
      'childTaxFreeThreshold',
      'Frítekjumark vegna barna',
      result.fritekjumarkBarns,
      { unit: 'ISK' },
    ),
    buildRow(
      'withholdingTaxRate',
      'Staðgreiðsluhlutfall',
      result.stadgreidsluhlutfall,
      { unit: '%' },
    ),
    buildRow(
      'employerPensionMatch',
      'Mótframlag í lífeyrissjóð',
      result.motframlag,
      {
        unit: 'ISK',
      },
    ),
    buildRow(
      'socialSecurityTaxBase',
      'Tryggingagjaldsstofn',
      result.tryggingagjaldsstofn,
      { unit: 'ISK' },
    ),
    buildRow('socialSecurityTax', 'Tryggingagjald', result.tryggingagjald, {
      unit: 'ISK',
    }),
  ]

  result.skattthrep?.forEach((bracket) => {
    if (bracket.numerThreps === null || bracket.numerThreps === undefined) {
      return
    }
    const group = `bracket-${bracket.numerThreps}`
    rows.push(
      buildRow('taxBracketLowerLimit', 'Neðri mörk', bracket.nedriMork, {
        unit: 'ISK',
        group,
      }),
      buildRow(
        'taxBracketRate',
        'Staðgreiðsluhlutfall',
        bracket.stadgreidsluhlutfall,
        { unit: '%', group },
      ),
      buildRow(
        'taxBracketAmount',
        'Reiknuð staðgreiðsla',
        bracket.reiknudStadgreidsla,
        { unit: 'ISK', group },
      ),
    )
  })

  return rows.filter(isDefined)
}

export const mapBarnabaeturResultToRows = (
  result: GetChildBenefitResponse | undefined,
): CalculatorResultRow[] => {
  if (!result) {
    throw new BadRequestException('No calculation result was returned')
  }

  const rows = [
    buildRow('benefitYear', 'Bótaár', result.botaAr),
    buildRow(
      'reductionRatio',
      'Skerðingarhlutfall',
      result.skerdingarhlutfall,
      {
        unit: '%',
      },
    ),
    buildRow('reductionThreshold', 'Skerðingarmörk', result.skerdingarmork, {
      unit: 'ISK',
    }),
    buildRow(
      'upperReductionThreshold',
      'Efri skerðingarmörk',
      result.efriSkerdingarmork,
      { unit: 'ISK' },
    ),
    buildRow(
      'reductionBase',
      'Stofn til skerðingar',
      result.stofnTilSkerdingar,
      { unit: 'ISK' },
    ),
    buildRow(
      'excessReductionBase',
      'Stofn til umframskerðingar',
      result.stofnTilUmframskerdingar,
      { unit: 'ISK' },
    ),
    buildRow(
      'reductionDueToIncome',
      'Skerðing vegna tekna',
      result.skerdingVegnaTekna,
      { unit: 'ISK' },
    ),
    buildRow(
      'excessReductionDueToIncome',
      'Umframskerðing vegna tekna',
      result.umframskerdingVegnaTekna,
      { unit: 'ISK' },
    ),
    buildRow(
      'excessReductionRatio',
      'Umframskerðingarhlutfall',
      result.umframskerdingarhlutfall,
      { unit: '%' },
    ),
    buildRow(
      'unreducedChildBenefit',
      'Óskertar barnabætur',
      result.oskertarBarnabaetur,
      { unit: 'ISK' },
    ),
    buildRow(
      'childBenefitPerChild',
      'Barnabætur per barn',
      result.barnabaeturPerBarn,
      { unit: 'ISK' },
    ),
    buildRow('totalChildBenefit', 'Barnabætur alls', result.barnabaeturAlls, {
      unit: 'ISK',
      emphasis: true,
    }),
    buildRow(
      'quarterlyPayment',
      'Greiðsla á ársfjórðungi',
      result.greidslurArsfjordungi,
      { unit: 'ISK' },
    ),
    buildRow(
      'incomeLinkedChildBenefit',
      'Tekjutengdar barnabætur',
      result.tekjutengdarBarnabaetur,
      { unit: 'ISK' },
    ),
    buildRow(
      'totalChildBenefitPerCouple',
      'Barnabætur alls hjá hjónum',
      result.barnabaeturAllsPrHjon,
      { unit: 'ISK' },
    ),
    buildRow(
      'additionForChildrenUnder7',
      'Viðbót vegna barna yngri en 7 ára',
      result.vidbotBornYngriEn7ara,
      { unit: 'ISK' },
    ),
    buildRow(
      'additionPerChildUnder7',
      'Viðbót per barn yngra en 7 ára',
      result.vidbotPerBarnYngraEn7ara,
      { unit: 'ISK' },
    ),
    buildRow(
      'reductionUnder7',
      'Skerðing undir 7 ára',
      result.skerdingUndir7ara,
      {
        unit: 'ISK',
      },
    ),
    buildRow(
      'reductionRatioUnder7',
      'Skerðingarhlutfall undir 7 ára',
      result.skerdingarhlutfallUndir7ara,
      { unit: '%' },
    ),
    buildRow('childrenBirthYears', 'Fæðingarár barna', result.faedingararBarna),
    buildRow(
      'childBenefitBeforeSplit',
      'Barnabætur fyrir skiptingu',
      result.barnabaeturFyrirSkiptingu,
      { unit: 'ISK' },
    ),
  ]

  return rows.filter(isDefined)
}

export const mapBifreidagjoldResultToRows = (
  result: GetVehicleTaxResponse | undefined,
): CalculatorResultRow[] => {
  if (!result) {
    throw new BadRequestException('No calculation result was returned')
  }

  const rows = [
    buildRow('period', 'Tímabil', result.timabil),
    buildRow('ownershipDays', 'Gjaldar', result.gjaldar),
    buildRow('curbWeight', 'Eigin þyngd', result.eiginthyngd, { unit: 'kg' }),
    buildRow('co2Emissions', 'Losun koltvísýrings (CO2)', result.co2),
    buildRow('vehicleTax', 'Bifreiðagjald', result.bifreidagjold, {
      unit: 'ISK',
    }),
    buildRow('processingFee', 'Úrvinnslugjald', result.urvinnslugjald, {
      unit: 'ISK',
    }),
    buildRow(
      'totalVehicleTax',
      'Bifreiðagjöld alls',
      result.bifreidagjoldAlls,
      { unit: 'ISK', emphasis: true },
    ),
  ]

  const buildSplitRows = (split: typeof result.fyrraTimabil, group: string) => {
    if (!split) return []
    return [
      buildRow('splitVehicleTax', 'Bifreiðagjald', split.bifreidagjald, {
        unit: 'ISK',
        group,
      }),
      buildRow('splitProcessingFee', 'Úrvinnslugjald', split.urvinnslugjald, {
        unit: 'ISK',
        group,
      }),
      buildRow(
        'splitTotalVehicleTax',
        'Bifreiðagjöld alls',
        split.bifreidagjaldAlls,
        { unit: 'ISK', group },
      ),
    ]
  }

  rows.push(
    ...buildSplitRows(result.fyrraTimabil, 'fyrraTimabil'),
    ...buildSplitRows(result.seinnaTimabil, 'seinnaTimabil'),
  )

  return rows.filter(isDefined)
}

export const mapBifreidahlunnindiResultToRows = (
  result: GetVehicleBenefitResponse | undefined,
): CalculatorResultRow[] => {
  if (!result) {
    throw new BadRequestException('No calculation result was returned')
  }

  const rows = [
    buildRow('purchaseYear', 'Kaupár', result.kaupar),
    buildRow('purchasePrice', 'Kaupverð', result.kaupverd, { unit: 'ISK' }),
    buildRow('monthlyBenefit', 'Mánaðarhlunnindi', result.manadarhlunnindi, {
      unit: 'ISK',
      emphasis: true,
    }),
    buildRow('annualBenefit', 'Árshlunnindi', result.arshlunnindi, {
      unit: 'ISK',
    }),
  ]

  return rows.filter(isDefined)
}
