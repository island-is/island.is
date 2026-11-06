export const parseDateSafely = (dateStr: string): Date | undefined => {
  try {
    // Rannis timestamps are space-separated, non-ISO (e.g. "2026-10-01 23:59:59").
    // Normalize to explicit UTC so parsing doesn't depend on the process's local TZ.
    const date = new Date(dateStr.replace(' ', 'T') + 'Z')
    return isNaN(date.getTime()) ? undefined : date
  } catch {
    return undefined
  }
}
