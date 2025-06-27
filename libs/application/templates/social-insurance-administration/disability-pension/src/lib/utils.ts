import { NO, YES, getValueViaPath } from "@island.is/application/core"
import { BankAccountType } from "@island.is/application/templates/social-insurance-administration-core/lib/constants"
import { socialInsuranceAdministrationMessage } from "@island.is/application/templates/social-insurance-administration-core/lib/messages"
import { Application } from "@island.is/application/types"
import { getAllCountryCodes } from "@island.is/shared/utils"
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


export const countryOptions = getAllCountryCodes().map(
  ({ name}) => {
    return {
      label: name,
      value: name,
    }
  },
)

export const YesOrNoOptions = [
    {
      value: YES,
      label: socialInsuranceAdministrationMessage.shared.yes,
    },
    {
      value: NO,
      label:  socialInsuranceAdministrationMessage.shared.no,
    }]
