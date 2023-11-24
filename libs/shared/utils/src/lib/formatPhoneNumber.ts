export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const formatPhoneNumber = (phoneNumber: string) => {
  const cleanPhoneNumber = phoneNumber
    .substring(phoneNumber.indexOf('-'), phoneNumber.length)
    .replace('-', '')

  return insertAt(cleanPhoneNumber, '-', 3)
}
