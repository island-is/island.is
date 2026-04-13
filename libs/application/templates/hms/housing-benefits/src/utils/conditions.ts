import { ExternalData, FormValue } from '@island.is/application/types'
import { BffUser } from '@island.is/shared/types'
import { doesAssigneeAddressMatchRentalContract } from './rentalAgreementUtils'

export const shouldShowRefetchNationalRegistrySection = (
  answers: FormValue,
  externalData: ExternalData,
  user: BffUser | null,
) => {
  const checked = (answers as Record<string, Record<string, string[]>>)
    ?.wrongHome?.addressUpdated
  const isCheckboxChecked =
    Array.isArray(checked) && checked.includes('confirmed')
  const addressMatches = doesAssigneeAddressMatchRentalContract(
    answers,
    externalData,
    user,
  )
  return isCheckboxChecked && !addressMatches
}
