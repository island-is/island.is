import { DebtorsDto } from '@island.is/clients/government-invoices'
import { Debtors } from '../models/debtors.model'
import { Debtor } from '../models/debtor.model'

export const mapDebtors = (data: DebtorsDto): Debtors => {
  const debtors: Debtor[] = data.debtors.map((debtor) => ({
    id: String(debtor.erpLegalEntityId),
    legalId: debtor.legalId,
    name: debtor.name,
  }))

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: debtors,
  }
}
