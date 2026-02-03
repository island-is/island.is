import { TrWebApiServicesCommonClientsModelsGetBankInformationReturn } from '@island.is/clients/social-insurance-administration'
import {
  DomesticBankInfo,
  ForeignBankInfo,
} from '../../socialInsuranceAdministrationClient.type'

type BaseBankInformation = {
  bankType: 'domestic' | 'foreign'
  ledger: string
  accountNumber: string
}

export type BankInformationDto =
  | ({
      bankType: 'domestic'
    } & BaseBankInformation &
      DomesticBankInfo)
  | ({
      bankType: 'foreign'
    } & BaseBankInformation &
      ForeignBankInfo)

//probably should split these into differnet classes if foreign or not

export const mapToBankInformationDto = (
  data: TrWebApiServicesCommonClientsModelsGetBankInformationReturn,
): BankInformationDto | undefined => {
  if (!data.ledger || !data.accountNumber) {
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
      ledger: data.ledger,
      accountNumber: data.accountNumber,
      iban: data.iban,
      swift: data.swift,
      foreignBankName: data.foreignBankName,
      foreignBankAddress: data.foreignBankAddress,
      foreignCurrency: data.currency,
    }
  }

  if (!data.bank) {
    return undefined
  }

  return {
    bankType: 'domestic',
    ledger: data.ledger,
    accountNumber: data.accountNumber,
    bank: data.bank,
  }
}
