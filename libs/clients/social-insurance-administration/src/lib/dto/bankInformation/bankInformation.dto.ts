import { TrWebApiServicesCommonClientsModelsGetBankInformationReturn } from '../../../../gen/fetch/v1'
import { ForeignBankInfo } from '../../socialInsuranceAdministrationClient.type'

type BaseBankInformation = {
  bank: string
  ledger: string
  currencies: string[]
}

export type BankInformationDto =
  | (BaseBankInformation & { bankType: 'domestic'; accountNumber: string })
  | (BaseBankInformation & { bankType: 'foreign' } & ForeignBankInfo)

//probably should split these into differnet classes if foreign or not

export const mapToBankInformationDto = (
  data: TrWebApiServicesCommonClientsModelsGetBankInformationReturn,
): BankInformationDto | undefined => {
  if (!data.bank || !data.ledger || !data.currencies) {
    return undefined
  }

  if (
    data.iban &&
    data.swift &&
    data.foreignBankName &&
    data.foreignBankAddress &&
    data.currency
  ) {
    return {
      bankType: 'foreign',
      bank: data.bank,
      ledger: data.ledger,
      iban: data.iban,
      swift: data.swift,
      foreignBankName: data.foreignBankName,
      foreignBankAddress: data.foreignBankAddress,
      foreignCurrency: data.currency,
      currencies: data.currencies,
    }
  }

  if (!data.accountNumber) {
    return undefined
  }

  return {
    bankType: 'domestic',
    ledger: data.ledger,
    accountNumber: data.accountNumber,
    bank: data.bank,
    currencies: data.currencies,
  }
}
