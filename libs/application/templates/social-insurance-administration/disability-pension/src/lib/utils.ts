import { getValueViaPath } from "@island.is/application/core"
import { BankAccountType } from "@island.is/application/templates/social-insurance-administration-core/lib/constants"
import { Application } from "@island.is/application/types"
import { parsePhoneNumberFromString } from "libphonenumber-js"

export const accountNationality = (applicationAnswers: Application['answers']): BankAccountType | null => {
  const bankAccountType = getValueViaPath<BankAccountType>(
    applicationAnswers,
    'paymentInfo.accountType',
    undefined
  )

  if (!bankAccountType) {
    return null;
  }

  return bankAccountType
}


export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}
