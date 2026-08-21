import { BadRequestException } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import type {
  GetApiBarnabaeturData,
  GetApiBarnabaeturResponse,
  GetApiStadgreidslaData,
  GetApiStadgreidslaResponse,
} from '@island.is/clients/rsk/reiknivelar'
import { RskCalculatorFieldKind, RskCalculatorType } from './models/enums'
import { CalculatorField } from './models/field.model'
import { CalculatorResultRow } from './models/resultRow.model'
import { CalculatorInputValue } from './dto/inputValue.input'

type StadgreidslaQuery = NonNullable<GetApiStadgreidslaData['query']>
type BarnabaeturQuery = GetApiBarnabaeturData['query']
type CalculatorQuery = StadgreidslaQuery | BarnabaeturQuery

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

/**
 * The raw API expects several fields as a ratio between 0 and 1. We expose
 * these to the web client as a 0-100 percentage for better UX and convert
 * back to a ratio here.
 */
const parsePercentageToRatio = (raw: string, key: string): number =>
  parseNumber(raw, key) / 100

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
  parse: (raw: string, key: string) => number | boolean
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
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
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
    label: 'Laun',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'ISK',
    parse: parseNumber,
  },
  {
    key: 'pensionFundRatio',
    rawKey: 'lifeyrissjodurHlutfall',
    label: 'Hlutfall í lífeyrissjóð',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: '%',
    min: 0,
    max: 100,
    parse: parsePercentageToRatio,
  },
  {
    key: 'privatePensionRatio',
    rawKey: 'sereignHlutfall',
    label: 'Hlutfall í séreignarsparnað',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: '%',
    min: 0,
    max: 100,
    parse: parsePercentageToRatio,
  },
  {
    key: 'taxCardUtilization',
    rawKey: 'nytingSkattkorts',
    label: 'Nýting skattkorts',
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
    label: 'Nýting skattkorts maka',
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
    label: 'Uppsafnaður persónuafsláttur',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'ISK',
    parse: parseNumber,
  },
  {
    key: 'vacationPay',
    rawKey: 'orlof',
    label: 'Orlof',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'ISK',
    parse: parseNumber,
  },
  {
    key: 'unionDues',
    rawKey: 'stettarfelag',
    label: 'Stéttarfélagsgjald',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'ISK',
    parse: parseNumber,
  },
  {
    key: 'otherDeduction',
    rawKey: 'annad',
    label: 'Annar frádráttur',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'ISK',
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
    parse: parseNumber,
  },
  {
    key: 'seamenAccidentInsurancePremium',
    rawKey: 'idgjaldSlysatryggingSjomanna',
    label: 'Iðgjald slysatryggingar sjómanna',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    unit: 'ISK',
    parse: parseNumber,
  },
]

const barnabaeturFields: FieldDefinition[] = [
  {
    key: 'marriedOrCohabiting',
    rawKey: 'hjuskaparstada',
    label: 'Í hjónabandi eða sambúð',
    kind: RskCalculatorFieldKind.BOOLEAN,
    required: true,
    parse: parseBoolean,
  },
  {
    key: 'incomeYear',
    rawKey: 'tekjuar',
    label: 'Tekjuár',
    kind: RskCalculatorFieldKind.NUMBER,
    required: true,
    parse: parseNumber,
  },
  {
    key: 'incomeBase',
    rawKey: 'tekjustofn',
    label: 'Tekjustofn',
    kind: RskCalculatorFieldKind.NUMBER,
    required: true,
    unit: 'ISK',
    parse: parseNumber,
  },
  {
    key: 'numberOfChildren',
    rawKey: 'fjoldiBarna',
    label: 'Fjöldi barna',
    kind: RskCalculatorFieldKind.NUMBER,
    required: true,
    parse: parseNumber,
  },
  {
    key: 'numberOfChildrenUnder7',
    rawKey: 'fjoldiBarnaUndir7ara',
    label: 'Fjöldi barna undir 7 ára',
    kind: RskCalculatorFieldKind.NUMBER,
    required: true,
    parse: parseNumber,
  },
  {
    key: 'splitCustody',
    rawKey: 'skiptBuseta',
    label: 'Skipt búseta',
    kind: RskCalculatorFieldKind.BOOLEAN,
    required: true,
    parse: parseBoolean,
  },
  {
    key: 'splitCustodyChildrenOver7',
    rawKey: 'skiptBornYfir7ara',
    label: 'Börn yfir 7 ára í skiptri búsetu',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    parse: parseNumber,
  },
  {
    key: 'splitCustodyChildrenUnder7',
    rawKey: 'skiptBornUndir7ara',
    label: 'Börn undir 7 ára í skiptri búsetu',
    kind: RskCalculatorFieldKind.NUMBER,
    required: false,
    parse: parseNumber,
  },
]

const fieldDefinitionsByType: Record<RskCalculatorType, FieldDefinition[]> = {
  [RskCalculatorType.WITHHOLDING_TAX_ON_WAGES]: stadgreidslaFields,
  [RskCalculatorType.CHILD_BENEFIT]: barnabaeturFields,
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
  const query: Record<string, number | boolean> = {}

  for (const definition of definitions) {
    const raw = valuesByKey.get(definition.key)
    if (raw === undefined) {
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
  result: GetApiStadgreidslaResponse | undefined,
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
  result: GetApiBarnabaeturResponse | undefined,
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
