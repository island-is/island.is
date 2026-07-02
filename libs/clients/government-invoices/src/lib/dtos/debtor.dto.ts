import { DebtorResponseDto } from '../../../gen/fetch'

export interface DebtorDto {
  erpLegalEntityId: number
  legalId?: string
  name: string
}

export const mapDebtorDto = (debtor: DebtorResponseDto): DebtorDto | null => {
  if (debtor.erpLegalEntityId === undefined || !debtor.name) {
    return null
  }

  return {
    erpLegalEntityId: debtor.erpLegalEntityId,
    legalId: debtor.legalId ?? undefined,
    name: debtor.name,
  }
}
