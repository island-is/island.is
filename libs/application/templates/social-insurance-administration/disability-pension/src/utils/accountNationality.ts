import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { FormValue } from '@island.is/application/types'
import { getApplicationAnswers } from './getApplicationAnswers'

export const accountNationality = (
  applicationAnswers: FormValue,
): BankAccountType | null => {
  const { paymentInfo } = getApplicationAnswers(applicationAnswers)
  return paymentInfo?.bankAccountType ?? null
}
