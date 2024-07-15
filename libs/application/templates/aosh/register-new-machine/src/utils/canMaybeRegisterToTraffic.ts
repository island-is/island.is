import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

const maybeAllowedCategories = ['IA', 'IF', 'IM', 'JL', 'KG']

export const canMaybeRegisterToTraffic = (answers: FormValue) => {
  const machineCategory = getValueViaPath(
    answers,
    'machine.basicInformation.category',
  )

  return maybeAllowedCategories.some((category) => category === machineCategory)
}
