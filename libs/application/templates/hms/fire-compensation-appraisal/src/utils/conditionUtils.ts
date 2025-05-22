import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const useageUnitsCondition = (answers: FormValue) => {
  const selectedRealEstateId = getValueViaPath<string>(answers, 'realEstate')
  return selectedRealEstateId !== undefined
}
