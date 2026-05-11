import { ExternalData, FormValue } from '@island.is/application/types'
import { getDefaultDrivingLicenses } from './defaultValues'
import { getValueViaPath } from '@island.is/application/core'

export const showOtherAddress = (formValue: FormValue): boolean => {
  const val = getValueViaPath<string[]>(
    formValue,
    'otherAddress.currentAddressIsNotDifferent',
  )
  return !val?.includes('yes')
}

export const showDrivingLicenseTypes = (
  formValue: FormValue,
  externalData: ExternalData,
): boolean => {
  const val = getValueViaPath<string[]>(formValue, 'licenses.hasDrivingLicense')
  if (val !== undefined) {
    return val?.includes('yes') ?? false
  }
  return getDefaultDrivingLicenses(externalData).length > 0
}

export const showHeavyMachineryLicenseTypes = (
  formValue: FormValue,
): boolean => {
  const val = getValueViaPath<string[]>(
    formValue,
    'licenses.hasHeavyMachineryLicense',
  )
  return val?.includes('yes') ?? false
}
