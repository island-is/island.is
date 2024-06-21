import { parsePhoneNumberFromString } from 'libphonenumber-js'
// export * from './formatText'
export * from './getChosenApplicant'
export * from './hasSecondGuardian'
export * from './hasDiscount'
export * from './hasReviewer'
export * from './getChargeItemCodes'
export * from './updateAnswers'
export * from './isChild'
export * from './isAvailableForApplication'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}
