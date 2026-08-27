import {
  formatBankInfo,
  formatCurrency,
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/shared/utils'

export { formatBankInfo, formatPhoneNumber, removeCountryCode }

export const formatPhoneNumberWithIcelandicCountryCode = (
  phoneNumber: string,
) => {
  const countryCodePattern = /^\+354(\d{7})$/ // Matches "+354" followed by exactly 7 digits
  const localNumberPattern = /^\d{7}$/ // Matches exactly 7 digits

  if (countryCodePattern.test(phoneNumber)) {
    const localNumber = phoneNumber.replace(countryCodePattern, '$1')
    return `+354 ${localNumber.slice(0, 3)}-${localNumber.slice(3)}`
  }

  if (localNumberPattern.test(phoneNumber)) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`
  }

  return phoneNumber
}

export { formatCurrency }

export const formatCurrencyWithoutSuffix = (answer: string) =>
  formatCurrency(answer, '')
