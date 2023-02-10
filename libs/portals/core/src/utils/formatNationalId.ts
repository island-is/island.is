export const formatNationalId = (nationalId: string) => {
  if (nationalId?.length === 10) {
    return `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`
  }

  return nationalId
}
