import { getValueViaPath } from '@island.is/application/core'
import { Application, BasicChargeItem } from '@island.is/application/types'
import { CHARGE_ITEM_CODES, EstateTypes } from '../lib/constants'

export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  const selectedEstate = getValueViaPath<string>(
    application.answers,
    'selectedEstate',
  )

  if (selectedEstate === EstateTypes.divisionOfEstateByHeirs) {
    return [{ code: CHARGE_ITEM_CODES.DIVISION_OF_ESTATE_BY_HEIRS }]
  }

  // Default: undivided estate
  return [{ code: CHARGE_ITEM_CODES.UNDIVIDED_ESTATE }]
}
