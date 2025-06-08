import { isDefined } from './is-defined'

/**
 * Returns the initials for a given name string.
 * - For a single word, returns the first two letters (uppercased).
 * - For multiple words, returns the first letter of the first and first letter of the last word (uppercased).
 *
 * @param name - The full name string to extract initials from.
 * @returns The initials in uppercase, or an empty string if name is empty.
 */
export const getInitials = (name: string): string => {
  if (!name) {
    return ''
  }

  const words = name
    .split(' ')
    // Remove empty strings from multiple spaces
    .filter(isDefined)

  if (words.length === 1) {
    // If there is only one word, return the first two letters
    return (words[0][0] + words[0][1]).toUpperCase()
  }

  // If there are multiple words, return the first letter of the first word and the first letter of the last word
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}
