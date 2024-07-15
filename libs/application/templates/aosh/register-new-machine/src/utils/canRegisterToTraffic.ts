import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

const allowedCategories = ['EA', 'EH', 'FH', 'HV', 'IB', 'IM', 'JF', 'KL']

export const canRegisterToTraffic = (answers: FormValue) => {
  const machineCategory = getValueViaPath(
    answers,
    'machine.basicInformation.category',
  )

  return allowedCategories.some((category) => category === machineCategory)
}
