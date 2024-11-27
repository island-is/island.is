export function formatNationalId(input?: string) {
  const str = String(input ?? '').replace(/\D/g, '')
  if (str.length < 10) {
    return '-'
  }
  return [str.substring(0, 6), str.substring(6, 10)].join('-')
}
