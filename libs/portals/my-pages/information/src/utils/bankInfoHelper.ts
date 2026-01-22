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

export const stringifyBankData = (obj: any) => {
  const bank = obj?.bank?.padStart(4, '0') ?? ''
  const account = obj?.account?.padStart(6, '0') ?? ''
  const l = obj?.l ?? ''
  const stringifyBankInfo = `${bank}-${l}-${account}`
  const formatted = formatBankInfo(stringifyBankInfo)
  return formatted
}

export const bankInfoObject = (bankInfo: string) => {
  const bankArray = bankInfo.trim().split('-')
  if (bankArray.length === 3) {
    return {
      bank: bankArray[0],
      l: bankArray[1],
      account: bankArray[2],
    }
  }
  return undefined
}
