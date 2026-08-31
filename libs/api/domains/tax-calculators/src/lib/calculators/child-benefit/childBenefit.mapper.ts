import { BadRequestException } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import type { GetChildBenefitResponse } from '@island.is/clients/rsk/calculators'
import { CalculatorResultRow } from '../../models/resultRow.model'
import { buildRow } from '../../utils/resultRow'

export const mapChildBenefitResultToRows = (
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
