export const parseDateSafely = (dateStr: string): Date | undefined => {
  try {
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? undefined : date
  } catch {
    return undefined
  }
}
