import { DebtorsDto } from '@island.is/clients/government-invoices'
import { DebtorCollection } from '../models/debtors.model'
import { Debtor } from '../models/debtor.model'

export const mapDebtors = (data: DebtorsDto): DebtorCollection => {
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
