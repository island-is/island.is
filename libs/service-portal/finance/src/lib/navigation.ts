import { PortalNavigationItem } from '@island.is/portals/core'
import { FJARSYSLAN_ID, m } from '@island.is/service-portal/core'
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
  ],
  icon: {
    icon: 'cellular',
  },
  heading: m.financeHeading,
  serviceProvider: FJARSYSLAN_ID,
  description: m.financeTooltip,
}
