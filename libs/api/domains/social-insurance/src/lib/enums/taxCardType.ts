import { registerEnumType } from '@nestjs/graphql'

export enum TaxCardType {
  PERSONAL_TAX_ALLOWANCE = 'PERSONAL_TAX_ALLOWANCE',
  SPOUSE_TAX_ALLOWANCE = 'SPOUSE_TAX_ALLOWANCE',
  SPOUSE_TAX_ALLOWANCE_GRANTED = 'SPOUSE_TAX_ALLOWANCE_GRANTED',
  REGARDING_THE_ESTATE = 'REGARDING_THE_ESTATE',
  TAX_EXEMPTION = 'TAX_EXEMPTION',
  UNKNOWN_TAX_CARD = 'UNKNOWN_TAX_CARD',
}

registerEnumType(TaxCardType, { name: 'SocialInsuranceTaxCardType' })

export const mapToTaxCardType = (
  taxCardType?: string | null,
): TaxCardType | undefined => {
  if (!taxCardType) {
    return undefined
  }

  if (Object.values(TaxCardType).includes(taxCardType as TaxCardType)) {
    return taxCardType as TaxCardType
  }

  return TaxCardType.UNKNOWN_TAX_CARD
}
