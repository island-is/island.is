import isNumber from 'lodash/isNumber'

/**
 * Coerces a given input to a number.
 * @param input The value to be coerced to a number. Can be a string or a number.
 * @returns The coerced number, or NaN if conversion is not possible.
 */
export const coerceToNumber = (input: string | number): number => {
  if (isNumber(input)) {
    return input
  }

  // Trim whitespace from the string
  const trimmedInput = input.trim()

  if (trimmedInput === '') {
    return NaN
  }

  // Try to convert the string to a number
  const parsedNumber = Number(trimmedInput)

  // Return the number or NaN if conversion failed
  return Number.isNaN(parsedNumber) ? NaN : parsedNumber
}
