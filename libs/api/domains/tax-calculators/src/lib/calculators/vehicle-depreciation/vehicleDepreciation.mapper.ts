import { BadRequestException } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import type { GetVehicleDepreciationResponse } from '@island.is/clients/rsk/calculators'
import { CalculatorResultRow } from '../../models/resultRow.model'
import { buildRow } from '../../utils/resultRow'

export const mapVehicleDepreciationResultToRows = (
  result: GetVehicleDepreciationResponse | undefined,
): CalculatorResultRow[] => {
  if (!result) {
    throw new BadRequestException('No calculation result was returned')
  }

  const rows = [
    buildRow('hasPurchaseInvoice', 'Kaupreikningur', result.kaupreikningur),
    buildRow('price', 'Verð', result.verd, { unit: 'ISK' }),
    buildRow('vat', 'Virðisaukaskattur', result.vsk, { unit: 'ISK' }),
    buildRow('markup', 'Álagning', result.alagning, { unit: 'ISK' }),
    buildRow('exciseDuty', 'Vörugjald', result.vorugjald, { unit: 'ISK' }),
    // `vatrygging` is "vátrygging" (insurance) -- not VAT-related, despite
    // the neighboring `vsk` field.
    buildRow('insurance', 'Vátrygging', result.vatrygging, { unit: 'ISK' }),
    buildRow('freightFee', 'Flutningsgjald', result.flutningsgjald, {
      unit: 'ISK',
    }),
    buildRow(
      'first12MonthsDepreciation',
      'Fyrningar fyrstu 12 mánuði',
      result.fyrstu12Manudir,
      { unit: 'ISK' },
    ),
    buildRow(
      'next24MonthsDepreciation',
      'Fyrningar næstu 24 mánuði',
      result.naestu24Manudir,
      { unit: 'ISK' },
    ),
    buildRow('remainingValue', 'Eftirstöðvar', result.rest, { unit: 'ISK' }),
    buildRow('totalDepreciation', 'Afskrift alls', result.totalFyrning, {
      unit: 'ISK',
      emphasis: true,
    }),
    buildRow('finalAmount', 'Lokaupphæð', result.finalAmount, {
      unit: 'ISK',
      emphasis: true,
    }),
  ]

  return rows.filter(isDefined)
}
