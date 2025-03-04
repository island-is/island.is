import { useLocale } from '@island.is/localization'
import { cardValidationError } from '../../messages'

type FormatMessage = ReturnType<typeof useLocale>['formatMessage']

export const validateCardExpiry = (
  value: string,
  formatMessage: FormatMessage,
) => {
  if (value.length < 4) {
    return formatMessage(cardValidationError.cardExpiryInvalid)
  }

  const [month, year] = value.split('/')

  // Check if missing month or year
  if (month?.length === 0 || year?.length === 0) {
    return formatMessage(cardValidationError.cardExpiry)
  }

  const currentYear = new Date().getFullYear() % 100
  const currentMonth = new Date().getMonth() + 1

  // Check if invalid month
  if (Number(month) < 1 || Number(month) > 12) {
    return formatMessage(cardValidationError.cardExpiryInvalidMonth)
  }

  // Check if year has passed
  if (Number(year) < currentYear) {
    return formatMessage(cardValidationError.cardExpiryExpired)
  }

  // Check if current year and month has passed
  if (Number(year) === currentYear && Number(month) < currentMonth) {
    return formatMessage(cardValidationError.cardExpiryExpired)
  }

  return true
}

export const validateCardCVC = (
  value: string,
  formatMessage: FormatMessage,
) => {
  if (value.length < 3) {
    return formatMessage(cardValidationError.cardCVCTooShort)
  }
  return true
}
