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
