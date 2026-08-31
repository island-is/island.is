import { BadRequestException } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import type { GetVehicleBenefitResponse } from '@island.is/clients/rsk/calculators'
import { CalculatorResultRow } from '../../models/resultRow.model'
import { buildRow } from '../../utils/resultRow'

export const mapVehicleBenefitResultToRows = (
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
    }),
    buildRow('annualBenefit', 'Árshlunnindi', result.arshlunnindi, {
      unit: 'ISK',
    }),
  ]

  return rows.filter(isDefined)
}
