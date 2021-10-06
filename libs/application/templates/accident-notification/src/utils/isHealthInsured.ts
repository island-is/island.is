import { FormValue } from '@island.is/application/core'

export const isHealthInsured = (formValue: FormValue) => {
  const isHealthInsured = (formValue as {
    accidentDetails: { isHealthInsured: string }
  })?.accidentDetails?.isHealthInsured
  if (isHealthInsured === undefined) return true
  return isHealthInsured === 'yes'
}
