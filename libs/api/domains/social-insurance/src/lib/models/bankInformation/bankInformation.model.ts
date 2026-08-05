import { createUnionType } from '@nestjs/graphql'
import { DomesticBankInformation } from './domesticBankInformation.model'
import { ForeignBankInformation } from './foreignBankInformation.model'

export const SocialInsuranceBankInformation = createUnionType({
  name: 'SocialInsuranceBankInformation',
  types: () => [DomesticBankInformation, ForeignBankInformation] as const,
  resolveType: (value) => {
    if ('accountNumber' in value) {
      return DomesticBankInformation
    }
    if ('iban' in value) {
      return ForeignBankInformation
    }
    return null
  },
})
