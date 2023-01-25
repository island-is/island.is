export const isValidNationalId = (nationalId: string): boolean => {
  return (
    sanitizeOnlyNumbers(nationalId).length === 10 &&
    isNaN(Number(sanitizeOnlyNumbers(nationalId))) === false
  )
}

const sanitizeOnlyNumbers = (value: string) => value?.replace(/[^0-9]/g, '')
