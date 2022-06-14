/**
 * Need a temporary solution for getting birthdays until we can use v2 of kennitala package
 * kennitala.info.birthday
 */

export const getBirthday = (nationalId: string) => {
  if (!nationalId) return undefined

  const cleanNatId = nationalId.replace(/(\D)+/g, '')
  if (cleanNatId.length !== 10) return undefined

  const isCompany = !!nationalId.match(/^[4-7]/)

  const date = isCompany
    ? `${Number(cleanNatId.substring(0, 1)) - 4}${cleanNatId.substring(2, 1)}`
    : cleanNatId.substring(0, 2)
  const month = cleanNatId.substring(2, 4)
  const year =
    (cleanNatId.substring(9, 10) === '0' ? '20' : '19') +
    cleanNatId.substring(4, 6)

  const dateOfBirth = new Date(Number(year), Number(month) - 1, Number(date))

  if (dateOfBirth.toDateString() === 'Invalid Date') return undefined

  return dateOfBirth
}
