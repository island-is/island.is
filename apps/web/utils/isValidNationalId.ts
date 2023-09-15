import kennitala from 'kennitala'

export const isValidNationalId = (nationalId: string): boolean => {
  return kennitala.isValid(nationalId)
}
