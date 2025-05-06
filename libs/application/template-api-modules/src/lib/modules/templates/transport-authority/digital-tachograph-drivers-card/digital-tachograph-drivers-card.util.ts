export const getUriFromImageStr = (
  imageData: string | undefined | null,
): string | null => {
  return imageData?.length
    ? `data:image/jpeg;base64,${imageData.substring(0, imageData.length)}`
    : null
}

export const getTodayDateWithMonthDiff = (diff?: number): Date => {
  const today = new Date()
  if (diff) {
    today.setMonth(today.getMonth() + diff)
  }
  return today
}
