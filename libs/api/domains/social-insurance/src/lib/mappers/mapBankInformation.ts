import { BankInformationDto } from '@island.is/clients/social-insurance-administration'
import { DomesticBankInformation } from '../models/bankInformation/domesticBankInformation.model'
import { ForeignBankInformation } from '../models/bankInformation/foreignBankInformation.model'

export const mapBankInformation = (
  dto: BankInformationDto,
): DomesticBankInformation | ForeignBankInformation => {
  if (dto.bankType === 'domestic') {
    return {
      bank: dto.bank,
      ledger: dto.ledger,
      accountNumber: dto.accountNumber,
      currencies: dto.currencies,
    } satisfies DomesticBankInformation
  }

  return {
    bank: dto.bank,
    ledger: dto.ledger,
    iban: dto.iban,
    swift: dto.swift,
    foreignBankName: dto.foreignBankName,
    foreignBankAddress: dto.foreignBankAddress,
    foreignCurrency: dto.foreignCurrency,
    currencies: dto.currencies,
  } satisfies ForeignBankInformation
}
