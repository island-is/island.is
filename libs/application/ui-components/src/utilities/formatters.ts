export const formatBankInfo = (bankInfo: string) => {
  const formattedBankInfo = bankInfo.replace(/^(.{4})(.{2})/, '$1-$2-')
  if (formattedBankInfo && formattedBankInfo.length === 14) {
    return formattedBankInfo
  }

  return bankInfo
}

export const formatPhoneNumber = (phoneNumber: string) => {
  if (/^\d{3}-\d{4}$/.test(phoneNumber)) {
    return phoneNumber
  }
  const formattedPhoneNumber = phoneNumber.replace(/^(.{3})/, '$1-')
  if (formattedPhoneNumber && formattedPhoneNumber.length === 8) {
    return formattedPhoneNumber
  }
  return phoneNumber
}

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

export const removeCountryCode = (phone: string) => {
  return phone.replace(/(^00354|^\+354|\D)/g, '')
}

export const formatCurrency = (answer: string) =>
  answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const formatCurrencyWithoutSuffix = (answer: string) =>
  answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
