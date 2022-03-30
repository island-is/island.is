export const formatBankInfo = (bankInfo: string) => {
  const formattedBankInfo = bankInfo.replace(/^(.{4})(.{2})/, '$1-$2-')
  if (formattedBankInfo && formattedBankInfo.length === 14) {
    return formattedBankInfo
  }

  return bankInfo
}

export const formatPhoneNumber = (value: string) => {
  const splitAt = (index: number) => (x: string) => [
    x.slice(0, index),
    x.slice(index),
  ]
  if (value.length > 3) return splitAt(3)(value).join('-')
  return value
}
