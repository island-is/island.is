import { getValueViaPath } from '@island.is/application/core'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { Application } from '@island.is/application/types'

export const accountNationality = (
  applicationAnswers: Application['answers'],
): BankAccountType | null => {
  const bankAccountType = getValueViaPath<BankAccountType>(
    applicationAnswers,
    'paymentInfo.bankAccountType',
    undefined,
  )

  if (!bankAccountType) {
    return null
  }

  return bankAccountType
}
