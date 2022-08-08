export const removeCountryCode = (phone: string) => {
  phone.replace(/(^00354|^\+354|\D)/g, '')
}
