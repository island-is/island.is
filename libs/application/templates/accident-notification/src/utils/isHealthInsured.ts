import { FormValue } from '@island.is/application/core'

export const isHealthInsured = (formValue: FormValue) => {
  console.log(formValue)
  const isHealthInsured = (formValue as {
    accidentDetails: { isHealthInsured: string }
  })?.accidentDetails?.isHealthInsured
  console.log('IS HEAKTH CHECK')
  console.log('check is ', isHealthInsured)
  if (isHealthInsured === undefined) return true
  return isHealthInsured === 'yes'
}
