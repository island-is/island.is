import { BankAccountDT } from '../../gen/fetch'

export const formatBankInfo = (bankInfo: BankAccountDT): string | null => {
  if (
    bankInfo &&
    !!bankInfo.bank &&
    !!bankInfo.ledger &&
    !!bankInfo.accountNumber
  ) {
    return `${bankInfo.bank}-${bankInfo.ledger}-${bankInfo.accountNumber}`
  }
  return null
}
