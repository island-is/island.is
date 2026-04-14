import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { BffUser } from '@island.is/shared/types'
import { getNationalIdPrefix } from './assigneeUtils'
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
