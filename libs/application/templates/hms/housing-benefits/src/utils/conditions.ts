import { getValueViaPath, YES } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { BffUser } from '@island.is/shared/types'
import { getNationalIdPrefix, nationalIdPreface } from './assigneeUtils'
import { doesAssigneeAddressMatchRentalContract } from './rentalAgreementUtils'

export const shouldShowRefetchNationalRegistrySection = (
  answers: FormValue,
  externalData: ExternalData,
  user: BffUser | null,
) => {
  if (!user) return false
  const prefix = getNationalIdPrefix(user)
  const checked = getValueViaPath<string[]>(
    answers,
    `${prefix}.wrongHome.addressUpdated`,
  )
  const isCheckboxChecked =
    Array.isArray(checked) && checked.includes('confirmed')
  const addressMatches = doesAssigneeAddressMatchRentalContract(
    answers,
    externalData,
    user,
  )
  return isCheckboxChecked && !addressMatches
}

export const assigneeUseMock = (
  answers: FormValue,
  externalData: ExternalData,
  user: BffUser | null,
) => {
  if (!user) return false

  const radioId = nationalIdPreface(
    { answers, externalData } as Application,
    user,
    'assigneeDevMockSettings.useMock',
  )
  const radioValue = getValueViaPath<string>(answers, radioId)
  return radioValue === YES
}

export const assigneeUseTaxReturnMock = (
  answers: FormValue,
  externalData: ExternalData,
  user: BffUser | null,
) => {
  if (!user) return false

  const checkedValueName = nationalIdPreface(
    { answers, externalData } as Application,
    user,
    'assigneeDevMockSettings.mockTaxReturn',
  )
  const checkedValue = getValueViaPath<string[]>(answers, checkedValueName)
  return checkedValue ? checkedValue.includes(YES) : false
}
