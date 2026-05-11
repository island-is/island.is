import { ExternalData, FormValue } from '@island.is/application/types'
import { getDefaultDrivingLicenses } from './defaultValues'

export const showOtherAddress = (formValue: FormValue): boolean => {
  const val = formValue.otherAddress as
    | { currentAddressIsNotDifferent?: string[] }
    | undefined
  return !val?.currentAddressIsNotDifferent?.includes('yes')
}

export const showDrivingLicenseTypes = (
  formValue: FormValue,
  externalData: ExternalData,
): boolean => {
  const val = formValue.licenses as
    | { hasDrivingLicense?: string[] }
    | undefined
  if (val?.hasDrivingLicense !== undefined) {
    return val.hasDrivingLicense.includes('yes')
  }
  return getDefaultDrivingLicenses(externalData).length > 0
}

export const showHeavyMachineryLicenseTypes = (
  formValue: FormValue,
): boolean => {
  const val = formValue.licenses as
    | { hasHeavyMachineryLicense?: string[] }
    | undefined
  return val?.hasHeavyMachineryLicense?.includes('yes') ?? false
}
