export const removeCountryCode = (phone: string) => {
  const phoneNumber = phone?.startsWith('+354')
    ? phone.slice(4)
    : phone?.startsWith('00354')
    ? phone?.slice(5)
    : phone

  return phoneNumber.replace(/\D/g, '')
}
