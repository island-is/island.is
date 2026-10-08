/**
 * The people one confirmation is for, as a phrase: "Ari", "Ari og Jón",
 * "Ari, Jón og Gunna". Each name once.
 */
export const joinNames = (names: string[], and: string): string => {
  const unique = [...new Set(names.filter(Boolean))]
  if (unique.length <= 1) {
    return unique[0] ?? ''
  }
  return `${unique.slice(0, -1).join(', ')} ${and} ${unique[unique.length - 1]}`
}
