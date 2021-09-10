/**
 * Checks if provided character is a numeric character
 */
export const isNumericCharacter = (character: string): boolean => {
  const possibleNumber = parseFloat(character)

  if (isNaN(possibleNumber)) {
    return false
  }

  return isFinite(possibleNumber)
}
