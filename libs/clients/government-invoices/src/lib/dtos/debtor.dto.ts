import { DebtorResponseDto } from '../../../gen/fetch'

export interface DebtorDto {
  debtorGuid: string
  legalId?: string
  name: string
}

export const mapDebtorDto = (debtor: DebtorResponseDto): DebtorDto | null => {
  if (!debtor.debtorGuid || !debtor.name) {
    return null
  }

  return {
    debtorGuid: debtor.debtorGuid,
    legalId: debtor.legalId ?? undefined,
    name: debtor.name,
  }
}
