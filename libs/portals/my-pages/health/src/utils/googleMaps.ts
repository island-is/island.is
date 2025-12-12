export const generateGoogleMapsLink = (address: string) => {
  const baseUrl = 'https://www.google.com/maps/dir/?api=1'
  const encodedAddress = encodeURIComponent(address)
  const fullUrl = `${baseUrl}&destination=${encodedAddress}`
  return fullUrl
}
