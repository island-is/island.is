import isEmpty from 'lodash/isEmpty'
import { BankInfo } from './types'

export const formatBankInfo = (bankInfo: string) => {
  const formattedBankInfo = bankInfo.replace(/[^0-9]/g, '')
  if (formattedBankInfo && formattedBankInfo.length === 12) {
    return formattedBankInfo
  }

  return bankInfo
}

export const getBankIsk = (bankInfo: BankInfo) => {
  return !isEmpty(bankInfo) &&
    bankInfo.bank &&
    bankInfo.ledger &&
    bankInfo.accountNumber
    ? bankInfo.bank + bankInfo.ledger + bankInfo.accountNumber
    : ''
}

export const friendlyFormatIBAN = (value: string | undefined) => {
  return !isEmpty(value) && value
    ? value
        .toUpperCase()
        .replace(/[\s]+/g, '')
        .replace(/(.{4})(?!$)/g, '$1 ')
    : ''
}

export const validIBAN = (value: string | undefined) => {
  const ibanRegex = new RegExp(
    /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,19}$/,
  )

  return value ? ibanRegex.test(value) : false
}

export const friendlyFormatSWIFT = (value: string | undefined) => {
  return !isEmpty(value) && value
    ? value
        .toUpperCase()
        .replace(/[\s]+/g, '')
        .replace(/(.{4})(?!$)/g, '$1 ')
        .replace(/(.{4}[\s].{2})(?!$)/g, '$1 ')
    : ''
}

export const validSWIFT = (value: string | undefined) => {
  const swiftRegex = new RegExp(
    /^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}([A-Z0-9]?){3}$/,
  )

  return value ? swiftRegex.test(value) : false
}
