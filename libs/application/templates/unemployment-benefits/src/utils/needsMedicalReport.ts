import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { WorkingAbility } from '../shared'

export const needsMedicalReport = (answers: FormValue) => {
  const workingAbility = getValueViaPath<string>(
    answers,
    'workingAbility.status',
    '',
  )

  return (
    workingAbility === WorkingAbility.PARTLY_ABLE ||
    workingAbility === WorkingAbility.DISABILITY
  )
}
