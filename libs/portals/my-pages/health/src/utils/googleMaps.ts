export const generateGoogleMapsLink = (
  lat?: number | null,
  lon?: number | null,
): string | null => {
  if (lat == null || lon == null) return null
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
}
