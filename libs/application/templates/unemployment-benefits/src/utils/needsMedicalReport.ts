import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { WorkingAbilityIds } from '../shared'

export const needsMedicalReport = (answers: FormValue) => {
  const workingAbility = getValueViaPath<string>(
    answers,
    'workingAbility.status',
    '',
  )

  return (
    workingAbility === WorkingAbilityIds.PARTLY_ABLE ||
    workingAbility === WorkingAbilityIds.DISABILITY
  )
}
