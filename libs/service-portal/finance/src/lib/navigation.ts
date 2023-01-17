import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { FinancePaths } from './paths'

export const financeNavigation: PortalNavigationItem = {
  name: m.finance,
  path: FinancePaths.FinanceRoot,
  serviceProvider: '6AoSHJJRDHQFfLiwBZvZi2',
  children: [
    {
      name: m.financeStatus,
      path: FinancePaths.FinanceStatus,
      serviceProvider: '6AoSHJJRDHQFfLiwBZvZi2',
    },
    {
      name: m.financeTransactions,
      path: FinancePaths.FinanceTransactions,
      serviceProvider: '6AoSHJJRDHQFfLiwBZvZi2',
    },
    {
      name: m.financeBills,
      path: FinancePaths.FinanceBills,
      serviceProvider: '6AoSHJJRDHQFfLiwBZvZi2',
    },
    {
      name: m.financeSchedules,
      path: FinancePaths.FinanceSchedule,
      serviceProvider: '6AoSHJJRDHQFfLiwBZvZi2',
    },
    {
      name: m.financeEmployeeClaims,
      path: FinancePaths.FinanceEmployeeClaims,
      serviceProvider: '6AoSHJJRDHQFfLiwBZvZi2',
    },
    {
      name: m.financeLocalTax,
      path: FinancePaths.FinanceLocalTax,
      serviceProvider: '6AoSHJJRDHQFfLiwBZvZi2',
    },
  ],
  icon: {
    icon: 'cellular',
  },
  description: m.financeDescription,
}
