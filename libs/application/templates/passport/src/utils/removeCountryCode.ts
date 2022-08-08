export const removeCountryCode = (phone: string) => {
  return phone?.startsWith('+354')
    ? phone.slice(4)
    : phone?.startsWith('00354')
    ? phone?.slice(5)
    : phone
}
