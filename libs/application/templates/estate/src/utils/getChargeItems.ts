import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  BasicChargeItem,
  ExtraData,
} from '@island.is/application/types'
import { CHARGE_ITEM_CODES, EstateTypes } from '../lib/constants'
import { getEstateDataFromApplication, isEstateInfo } from '../lib/utils'

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

export const getExtraData = (application: Application): ExtraData[] => {
  const data = getEstateDataFromApplication(application)
  if (isEstateInfo(data)) {
    return [
      { name: 'caseNumber', value: data.estate.caseNumber ?? '' },
      {
        name: 'nationalIdOfDeceased',
        value: data.estate.nationalIdOfDeceased ?? '',
      },
    ]
  }
  return []
}
