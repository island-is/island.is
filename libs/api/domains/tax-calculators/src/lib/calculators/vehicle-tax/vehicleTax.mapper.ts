import { BadRequestException } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import type { GetVehicleTaxResponse } from '@island.is/clients/rsk/calculators'
import { CalculatorResultRow } from '../../models/resultRow.model'
import { buildRow } from '../../utils/resultRow'

export const mapVehicleTaxResultToRows = (
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
