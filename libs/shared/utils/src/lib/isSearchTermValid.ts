import { isEmail } from 'class-validator'
import { parsePhoneNumber } from 'libphonenumber-js'
import * as kennitala from 'kennitala'

/**
 * Validates if the search term is a valid nationalId, email or an icelandic phone number
 * @param search The search term to validate
 */
export const isSearchTermValid = (search: string): boolean => {
  try {
    if (!search) return false
    return (
      isEmail(search) ||
      kennitala.isValid(search) ||
      parsePhoneNumber(search, 'IS').isValid()
    )
  } catch (e) {
    return false
  }
}
