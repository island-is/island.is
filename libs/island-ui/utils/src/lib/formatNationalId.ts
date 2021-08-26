export const formatNationalId = (nationalId: string): string =>
  `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`
