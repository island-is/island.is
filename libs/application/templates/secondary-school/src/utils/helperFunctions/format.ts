import { parsePhoneNumberFromString } from 'libphonenumber-js'
import kennitala from 'kennitala'

export const formatPhoneNumber = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return ''
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

export const formatKennitala = (nationalId: string | undefined): string => {
  if (!nationalId) return ''
  return kennitala.format(nationalId)
}

export const getTranslatedProgram = (
  lang?: string,
  program?: {
    nameIs?: string
    nameEn?: string
  },
): string => {
  // Note: Not all programs have the english translation
  const fallback = program?.nameIs || ''
  return (lang === 'is' ? program?.nameIs : program?.nameEn) || fallback
}
