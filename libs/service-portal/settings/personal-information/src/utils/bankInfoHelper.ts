export const formatBankInfo = (bankInfo: string) => {
  if (/^\d{4}-\d{2}-\d{6}$/.test(bankInfo)) {
    return bankInfo
  }

  const formattedBankInfo = bankInfo.replace(/^(.{4})(.{2})/, '$1-$2-')
  if (formattedBankInfo && formattedBankInfo.length === 14) {
    return formattedBankInfo
  }

  return ''
}
