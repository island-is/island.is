import isEmpty from 'lodash/isEmpty'
import { BankInfo, PaymentInfo } from '../types'
import { BankAccountType, TaxLevelOptions } from './constants'
import { socialInsuranceAdministrationMessage } from './messages'
import { Option } from '@island.is/application/types'
import { YES, NO } from '@island.is/application/core'

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

export const formatBank = (bankInfo: string) => {
  return bankInfo.replace(/^(.{4})(.{2})/, '$1-$2-')
}

// We should only send bank account to TR if applicant is registering
// new one or changing.
export const shouldNotUpdateBankAccount = (
  bankInfo: BankInfo,
  paymentInfo: PaymentInfo,
) => {
  const {
    bankAccountType,
    bank,
    iban,
    swift,
    bankName,
    bankAddress,
    currency,
  } = paymentInfo
  if (bankAccountType === BankAccountType.FOREIGN) {
    return (
      !isEmpty(bankInfo) &&
      bankInfo.iban === iban?.replace(/[\s]+/g, '') &&
      bankInfo.swift === swift?.replace(/[\s]+/g, '') &&
      bankInfo.foreignBankName === bankName &&
      bankInfo.foreignBankAddress === bankAddress &&
      bankInfo.currency === currency
    )
  } else {
    return getBankIsk(bankInfo) === bank ?? false
  }
}

export const getCurrencies = (
  currencies: string[],
  hideISKCurrency?: string,
) => {
  return (
    currencies
      .filter((i) => i !== hideISKCurrency)
      .map((i) => ({
        label: i,
        value: i,
      })) ?? []
  )
}

export const typeOfBankInfo = (
  bankInfo: BankInfo,
  bankAccountType: BankAccountType,
) => {
  return bankAccountType
    ? bankAccountType
    : !isEmpty(bankInfo)
    ? bankInfo.bank && bankInfo.ledger && bankInfo.accountNumber
      ? BankAccountType.ICELANDIC
      : BankAccountType.FOREIGN
    : BankAccountType.ICELANDIC
}

export const getYesNoOptions = () => {
  const options: Option[] = [
    {
      value: YES,
      label: socialInsuranceAdministrationMessage.shared.yes,
    },
    {
      value: NO,
      label: socialInsuranceAdministrationMessage.shared.no,
    },
  ]

  return options
}

export const getTaxOptions = () => {
  const options: Option[] = [
    {
      value: TaxLevelOptions.INCOME,
      label: socialInsuranceAdministrationMessage.payment.taxIncomeLevel,
    },
    {
      value: TaxLevelOptions.FIRST_LEVEL,
      label: socialInsuranceAdministrationMessage.payment.taxFirstLevel,
    },
    {
      value: TaxLevelOptions.SECOND_LEVEL,
      label: socialInsuranceAdministrationMessage.payment.taxSecondLevel,
    },
  ]

  return options
}

export const getTaxLevelOption = (option: TaxLevelOptions) => {
  switch (option) {
    case TaxLevelOptions.FIRST_LEVEL:
      return socialInsuranceAdministrationMessage.payment.taxFirstLevel
    case TaxLevelOptions.SECOND_LEVEL:
      return socialInsuranceAdministrationMessage.payment.taxSecondLevel
    default:
      return socialInsuranceAdministrationMessage.payment.taxIncomeLevel
  }
}
