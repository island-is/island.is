import { getValueViaPath } from "@island.is/application/core"
import { BankAccountType } from "@island.is/application/templates/social-insurance-administration-core/lib/constants"
import { Application } from "@island.is/application/types"
import { parsePhoneNumberFromString } from "libphonenumber-js"

export const isForeignAccount= (applicationAnswers: Application['answers']): boolean => {
  const bankAccountType = getValueViaPath<BankAccountType>(
    applicationAnswers,
    'paymentInfoForm.accountType',
    undefined
  )

  return bankAccountType === BankAccountType.FOREIGN
}


export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}
