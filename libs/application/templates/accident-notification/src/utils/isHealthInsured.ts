import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isHealthInsured = (formValue: FormValue) => {
  const isHealthInsured = getValueViaPath(
    formValue,
    'accidentDetails.isHealthInsured',
  ) as string
  if (isHealthInsured === undefined) return true
  return isHealthInsured === 'yes'
}
