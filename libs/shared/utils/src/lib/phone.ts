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

export const removeCountryCode = (phone: string) => {
  return phone.replace(/(^00354|^\+354|\D)/g, '')
}

export const formatPhoneNumberWithIcelandicCountryCode = (
  phoneNumber: string,
) => {
  const countryCodePattern = /^\+354(\d{7})$/
  const localNumberPattern = /^\d{7}$/

  if (countryCodePattern.test(phoneNumber)) {
    const localNumber = phoneNumber.replace(countryCodePattern, '$1')
    return `+354 ${localNumber.slice(0, 3)}-${localNumber.slice(3)}`
  }

  if (localNumberPattern.test(phoneNumber)) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`
  }

  return phoneNumber
}
