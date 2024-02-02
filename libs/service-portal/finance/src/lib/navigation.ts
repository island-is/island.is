import { PortalNavigationItem } from '@island.is/portals/core'
import { FJARSYSLAN_SLUG, HMS_SLUG, m } from '@island.is/service-portal/core'
import { FinancePaths } from './paths'

export const financeNavigation: PortalNavigationItem = {
  name: m.finance,
  path: FinancePaths.FinanceRoot,
  children: [
    {
      name: m.financeStatus,
      path: FinancePaths.FinanceStatus,
    },
    {
      name: m.financeTransactions,
      path: FinancePaths.FinanceTransactions,
      children: [
        {
          name: m.financeTransactionsCategories,
          path: FinancePaths.FinanceTransactions,
        },
        {
          name: m.financeTransactionPeriods,
          path: FinancePaths.FinanceTransactionPeriods,
        },
      ],
    },
    {
      name: m.financeBills,
      path: FinancePaths.FinanceBills,
    },
    {
      name: m.financeSchedules,
      path: FinancePaths.FinanceSchedule,
    },
    {
      name: m.financeEmployeeClaims,
      path: FinancePaths.FinanceEmployeeClaims,
    },
    {
      name: m.financeLocalTax,
      path: FinancePaths.FinanceLocalTax,
    },
    {
      name: m.financeLoans,
      path: FinancePaths.FinanceLoans,
      serviceProvider: 'rikislogreglustjori',
      description: m.realEstateTooltip,
    },
  ],
  icon: {
    icon: 'cellular',
  },
  heading: m.financeHeading,
  serviceProvider: FJARSYSLAN_SLUG,
  description: m.financeTooltip,
}
