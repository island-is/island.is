import { FormValue, getValueViaPath } from '@island.is/application/core'

export const isHealthInsured = (formValue: FormValue) => {
  const isHealthInsured = getValueViaPath(
    formValue,
    'accidentDetails.isHealthInsure',
  ) as string
  if (isHealthInsured === undefined) return true
  return isHealthInsured === 'yes'
}
