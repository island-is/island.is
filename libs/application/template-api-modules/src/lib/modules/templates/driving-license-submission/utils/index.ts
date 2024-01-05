export const removeCountryCode = (phone: string) => {
  return phone.replace(/(^00354|^\+354|\D)/g, '')
}
