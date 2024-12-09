import { useLocale } from '@island.is/localization'
import { cardError } from '../../messages'

type FormatMessage = ReturnType<typeof useLocale>['formatMessage']

export const validateCardExpiry = (
  value: string,
  formatMessage: FormatMessage,
) => {
  if (value.length < 4) {
    return formatMessage(cardError.cardExpiryInvalid)
  }

  const [month, year] = value.split('/')

  // Check if missing month or year
  if (month?.length === 0 || year?.length === 0) {
    return formatMessage(cardError.cardExpiry)
  }

  const currentYear = new Date().getFullYear() % 100
  const currentMonth = new Date().getMonth() + 1

  // Check if invalid month
  if (Number(month) < 1 || Number(month) > 12) {
    return formatMessage(cardError.cardExpiryInvalidMonth)
  }

  // Check if year has passed
  if (Number(year) < currentYear) {
    return formatMessage(cardError.cardExpiryExpired)
  }

  // Check if current year and month has passed
  if (Number(year) === currentYear && Number(month) < currentMonth) {
    return formatMessage(cardError.cardExpiryExpired)
  }

  return true
}

export const validateCardCVC = (
  value: string,
  formatMessage: FormatMessage,
) => {
  if (value.length < 3) {
    return formatMessage(cardError.cardCVCTooShort)
  }
  return true
}
