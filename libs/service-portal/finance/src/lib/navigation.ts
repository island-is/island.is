import { PortalNavigationItem } from '@island.is/portals/core'
import { FJARSYSLAN_SLUG, HMS_SLUG, m } from '@island.is/service-portal/core'
import { FinancePaths } from './paths'

export const financeNavigation: PortalNavigationItem = {
  name: m.finance,
  path: FinancePaths.FinanceRoot,
  children: [
    {
      name: m.financeStatus,
      description: m.financeStatusDescription,
      serviceProvider: 'fjarsysla-rikisins',
      serviceProviderTooltip: m.financeTooltip,
      displayServiceProviderLogo: true,
      path: FinancePaths.FinanceStatus,
    },
    {
      name: m.financeTransactions,
      description: m.financeTransactionsDescription,
      serviceProvider: 'fjarsysla-rikisins',
      serviceProviderTooltip: m.financeTooltip,
      displayServiceProviderLogo: true,
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
      name: m.financePayments,
      path: FinancePaths.FinanceBills,
    },
    {
      name: m.financeSchedules,
      path: FinancePaths.FinanceSchedule,
    },
    {
      name: m.financeClaims,
      path: FinancePaths.FinanceEmployeeClaims,
    },
    {
      name: m.financeLocalTax,
      path: FinancePaths.FinanceLocalTax,
    },
    {
      name: m.financeLoans,
      path: FinancePaths.FinanceLoans,
    },
  ],
  icon: {
    icon: 'cellular',
  },
  heading: m.financeHeading,
  description: m.financeTooltip,
}
