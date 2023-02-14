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

  if (phoneNumber.startsWith('+354') && phoneNumber.length === 11) {
    return phoneNumber.replace(/^(.{4})/, '$1 ').replace(/^(.{8})/, '$1-')
  }

  const formattedPhoneNumber = phoneNumber.replace(/^(.{3})/, '$1-')
  if (formattedPhoneNumber && formattedPhoneNumber.length === 8) {
    return formattedPhoneNumber
  }
  return phoneNumber
}

export const removeCountryCode = (phone: string) => {
  return phone.replace(/(^00354|^\+354|\D)/g, '')
}

export const formatCurrency = (answer: string) =>
  answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
