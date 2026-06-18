import { DebtorResponseDto } from '../../../gen/fetch'

export interface DebtorDto {
  legalId: string
  name: string
}

export const mapDebtorDto = (debtor: DebtorResponseDto): DebtorDto | null => {
  if (!debtor.legalId || !debtor.name) {
    return null
  }

  return {
    legalId: debtor.legalId,
    name: debtor.name,
  }
}
