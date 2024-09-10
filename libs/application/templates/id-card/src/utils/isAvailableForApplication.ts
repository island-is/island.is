import {
  CombinedApplicantInformation,
  EXPIRATION_LIMIT_MONTHS,
} from '../lib/constants'

export const isAvailableForApplication = (
  idTypeChosen: string,
  applicantInformation: CombinedApplicantInformation,
) => {
  if (
    applicantInformation.age &&
    applicantInformation.age < 18 &&
    idTypeChosen === 'ID'
  ) {
    return false
  }

  const oldPassportType =
    applicantInformation.passport &&
    `${applicantInformation.passport.type}${applicantInformation.passport.subType}`
  const dateStr =
    applicantInformation.passport &&
    applicantInformation.passport.expirationDate

  if (
    (idTypeChosen === 'ID' && oldPassportType === 'II') ||
    oldPassportType === 'IG'
  ) {
    // if types are not the same, then expiration date does not matter since you can apply for an id card type that you don't have regardless of old one
    return true
  }

  //applicant has old id and we need to calculate expiry date
  if (dateStr) {
    // Calculate the date x months from today based on expiration limit
    const inputDate = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const xMonthsLater = new Date(today)
    xMonthsLater.setMonth(xMonthsLater.getMonth() + EXPIRATION_LIMIT_MONTHS)

    // Check if the input date is within the expiration limit
    const withinExpirationDate = inputDate >= today && inputDate <= xMonthsLater

    return withinExpirationDate //return if the date is within the expiration date
  }

  return true
}
