export const generateGoogleMapsLinkFromCoords = (
  lat?: number | null,
  lon?: number | null,
): string | null => {
  if (lat == null || lon == null) return null
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
}
