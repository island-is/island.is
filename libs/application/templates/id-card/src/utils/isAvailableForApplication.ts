import { EXPIRATION_LIMIT_MONTHS } from '../lib/constants'

export const isAvailableForApplication = (
  dateStr: string,
  idTypeChosen: string,
  oldIdType: string,
  age?: number,
) => {
  if (age && age < 18 && idTypeChosen === 'ID') {
    return false
  }

  const inputDate = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Calculate the date x months from today based on expiration limit
  const xMonthsLater = new Date(today)
  xMonthsLater.setMonth(xMonthsLater.getMonth() + EXPIRATION_LIMIT_MONTHS)

  // Check if the input date is within the expiration limit
  const withinExpirationDate = inputDate >= today && inputDate <= xMonthsLater
  if (idTypeChosen === 'ID' && (oldIdType === 'II' || oldIdType === 'IG')) {
    // if types are not the same, then expiration date does not matter since you can apply for an id card type that you don't have regardless of old one
    return true
  }

  return withinExpirationDate //else return if the date is within the expiration date
}
