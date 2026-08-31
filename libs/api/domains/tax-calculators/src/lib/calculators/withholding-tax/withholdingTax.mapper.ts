import { BadRequestException } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import type { GetWithholdingTaxResponse } from '@island.is/clients/rsk/calculators'
import { CalculatorResultRow } from '../../models/resultRow.model'
import { buildRow } from '../../utils/resultRow'

export const mapWithholdingTaxResultToRows = (
  result: GetWithholdingTaxResponse | undefined,
): CalculatorResultRow[] => {
  if (!result) {
    throw new BadRequestException('No calculation result was returned')
  }

  const bracketRows = (result.skattthrep ?? [])
    .filter(
      (bracket) =>
        bracket.numerThreps !== null && bracket.numerThreps !== undefined,
    )
    .map((bracket) =>
      buildRow(
        `taxBracket-${bracket.numerThreps}`,
        `Skattþrep ${bracket.numerThreps} (${bracket.stadgreidsluhlutfall}%)`,
        bracket.reiknudStadgreidsla,
        { unit: 'ISK' },
      ),
    )

  const rows = [
    buildRow('monthlySalary', 'Mánaðarlaun', result.manadarlaun, {
      unit: 'ISK',
    }),
    buildRow(
      'pensionFundContribution',
      'Greitt í lífeyrissjóð',
      result.lifeyrissjodur,
      { unit: 'ISK' },
    ),
    buildRow(
      'privatePensionContribution',
      'Greitt í séreignarsparnað',
      result.sereignarsjodur,
      { unit: 'ISK' },
    ),
    buildRow('taxBase', 'Skattstofn', result.skattstofn, { unit: 'ISK' }),
    ...bracketRows,
    buildRow(
      'calculatedWithholdingTax',
      'Samanlögð staðgreiðsla',
      result.reiknudStadgreidsla,
      { unit: 'ISK' },
    ),
    buildRow(
      'personalTaxCredit',
      'Eigin persónuafsláttur',
      result.personuafslattur,
      { unit: 'ISK' },
    ),
    buildRow(
      'personalTaxCreditFromSpouse',
      'Persónuafsláttur maka',
      result.personuafslatturFraMaka,
      { unit: 'ISK' },
    ),
    buildRow(
      'accumulatedPersonalTaxCredit',
      'Uppsafnaður persónuafsláttur nýttur',
      result.uppsafnadurPersonuafslattur,
      { unit: 'ISK' },
    ),
    buildRow(
      'paidWithholdingTax',
      'Staðgreiðsla eftir persónuafslátt',
      result.greiddStadgreidsla,
      { unit: 'ISK' },
    ),
    buildRow('netPay', 'Heildarlaun eftir frádrátt', result.utborgudLaun, {
      unit: 'ISK',
    }),
    buildRow(
      'employerPensionMatch',
      'Mótframlag í lífeyrissjóð',
      result.motframlag,
      { unit: 'ISK' },
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
    buildRow(
      'pensionFundPercentageUsed',
      'Nýtt hlutfall í lífeyrissjóð',
      result.lifeyrisjodurProsenta,
      { unit: '%' },
    ),
    buildRow(
      'privatePensionPercentageUsed',
      'Nýtt hlutfall í séreignarsjóð',
      result.sereignProsenta,
      { unit: '%' },
    ),
    buildRow('totalDeductions', 'Frádráttur alls', result.fradratturAlls, {
      unit: 'ISK',
    }),
    buildRow('highIncomeTax', 'Hátekjuskattur', result.hatekjuskattur, {
      unit: 'ISK',
    }),
    buildRow(
      'highIncomeTaxApplied',
      'Reiknaði hátekjuskatt',
      result.reiknadiHatekjuskatt,
    ),
    buildRow(
      'childTaxFreeThreshold',
      'Fritekjumark barna',
      result.fritekjumarkBarns,
      { unit: 'ISK' },
    ),
    buildRow(
      'withholdingTaxRate',
      'Staðgreiðsluhlutfall',
      result.stadgreidsluhlutfall,
      { unit: '%' },
    ),
  ]

  return rows.filter(isDefined)
}
