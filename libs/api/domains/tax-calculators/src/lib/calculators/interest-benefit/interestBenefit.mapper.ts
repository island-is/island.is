import { BadRequestException } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import type { GetInterestBenefitResponse } from '@island.is/clients/rsk/calculators'
import { CalculatorResultRow } from '../../models/resultRow.model'
import { buildRow } from '../../utils/resultRow'

export const mapInterestBenefitResultToRows = (
  result: GetInterestBenefitResponse | undefined,
): CalculatorResultRow[] => {
  if (!result) {
    throw new BadRequestException('No calculation result was returned')
  }

  const rows = [
    buildRow(
      'maxInterestExpense',
      'Hámark vaxtagjalda',
      result.hamarkVaxtagjalda,
      {
        unit: 'ISK',
      },
    ),
    buildRow(
      'interestExpenseForCalculation',
      'Vaxtagjöld til útreiknings',
      result.vaxtagjoldTilUtreiknings,
      { unit: 'ISK' },
    ),
    buildRow('incomeBase', 'Tekjustofn', result.tekjustofn, { unit: 'ISK' }),
    buildRow('assetBase', 'Eignastofn', result.eignastofn, { unit: 'ISK' }),
    buildRow(
      'outstandingLoanBalance',
      'Eftirstöðvar lána',
      result.eftirstodvar,
      { unit: 'ISK' },
    ),
    buildRow('interestExpense', 'Vaxtagjöld', result.vaxtagjold, {
      unit: 'ISK',
    }),
    buildRow('maxInterestBenefit', 'Hámark vaxtabóta', result.hamarkVaxtabota, {
      unit: 'ISK',
    }),
    buildRow(
      'reductionDueToIncome',
      'Skerðing vegna tekna',
      result.skerdingVegnaTekna,
      { unit: 'ISK' },
    ),
    buildRow(
      'interestBenefitAfterIncomeReduction',
      'Vaxtabætur eftir skerðingu tekna',
      result.vaxtabaeturEftirSkerdinguTekna,
      { unit: 'ISK' },
    ),
    buildRow(
      'incomeReductionRatio',
      'Tekjuskerðingarhlutfall',
      result.tekjuskerdingarhlutfall,
      { unit: '%' },
    ),
    buildRow(
      'debtReductionRatio',
      'Skuldaskerðingarhlutfall',
      result.skuldaskerdingarhlutfall,
      { unit: '%' },
    ),
    buildRow(
      'reductionDueToAssets',
      'Skerðing vegna eigna',
      result.skerdingVegnaEigna,
      { unit: 'ISK' },
    ),
    buildRow(
      'assetReductionRatio',
      'Eignaskerðingarhlutfall',
      result.eignaskerdingarhlutfall,
      { unit: '%' },
    ),
    buildRow(
      'reductionAct2003',
      'Skerðing skv. lögum 2003',
      result.skerdingLog2003,
      {
        unit: 'ISK',
      },
    ),
    buildRow(
      'reductionAct2004',
      'Skerðing skv. lögum 2004',
      result.skerdingLog2004,
      {
        unit: 'ISK',
      },
    ),
    buildRow(
      'totalInterestBenefit',
      'Vaxtabætur alls',
      result.vaxtabaeturAlls,
      { unit: 'ISK', emphasis: true },
    ),
    buildRow(
      'specialInterestSubsidy',
      'Sérstök vaxtaniðurgreiðsla',
      result.serstokVaxtanidurgreidsla,
      { unit: 'ISK' },
    ),
    buildRow('reachedMaximum', 'Náði hámarki', result.nadiHamarki),
    buildRow('wasBelowMinimum', 'Var undir lágmarki', result.varUndirLamarki),
  ]

  return rows.filter(isDefined)
}
