import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const usageUnitsCondition = (answers: FormValue) => {
  const selectedRealEstateId = getValueViaPath<string>(answers, 'realEstate')
  const selectedUnits = getValueViaPath<string>(
    answers,
    'selectedPropertyByCode',
  )
  return selectedRealEstateId !== undefined || selectedUnits !== undefined
}
