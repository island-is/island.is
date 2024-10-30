/**
 * Shorten the permno for logging purpose
 * @param permno
 * @returns
 */
export const getShortPermno = (permno: string) => {
  return permno.slice(-3)
}
