import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { FinancePaths } from './paths'

export const financeNavigation: PortalNavigationItem = {
  name: m.finance,
  description: m.financeTooltip,
  intro: m.financeHeading,
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
      serviceProvider: 'fjarsysla-rikisins',
      serviceProviderTooltip: m.financeTooltip,
      displayServiceProviderLogo: true,
      path: FinancePaths.FinanceTransactions,
      children: [
        {
          name: m.financeTransactionsCategories,
          description: m.financeTransactionsDescription,
          path: FinancePaths.FinanceTransactionCategories,
        },
        {
          name: m.financeTransactionsVehiclesMileage,
          description: m.financeTransactionsVehicleMileageDescription,
          path: FinancePaths.FinanceTransactionVehicleMileage,
        },
        {
          name: m.financeTransactionPeriods,
          description: m.financeTransactionPeriodsDescription,
          path: FinancePaths.FinanceTransactionPeriods,
        },
      ],
    },
    {
      name: m.financePayments,
      serviceProvider: 'fjarsysla-rikisins',
      serviceProviderTooltip: m.financeTooltip,
      displayServiceProviderLogo: true,
      path: FinancePaths.FinancePayments,
      children: [
        {
          name: m.financeBills,
          description: m.financeBillsDescription,
          path: FinancePaths.FinancePaymentsBills,
        },
        {
          name: m.financeSchedules,
          description: m.financeSchedulesDescription,
          path: FinancePaths.FinancePaymentsSchedule,
        },
        {
          name: m.financeHousingBenefits,
          description: m.financeHousingBenefitsDesc,
          path: FinancePaths.FinancePaymentsHousingBenefits,
          serviceProviderTooltip: m.hmsHousingBenefitsTooltip,
          serviceProvider: 'hms',
          displayServiceProviderLogo: true,
        },
      ],
    },
    {
      name: m.financeClaims,
      description: m.financeEmployeeClaimsDescription,
      serviceProvider: 'fjarsysla-rikisins',
      serviceProviderTooltip: m.financeTooltip,
      displayServiceProviderLogo: true,
      path: FinancePaths.FinanceEmployeeClaims,
    },
    {
      name: m.financeLocalTax,
      description: m.financeLocalTaxDescription,
      serviceProvider: 'fjarsysla-rikisins',
      serviceProviderTooltip: m.financeTooltip,
      displayServiceProviderLogo: true,
      path: FinancePaths.FinanceLocalTax,
    },
    {
      name: m.financeLoans,
      description: m.financeLoansDescription,
      serviceProvider: 'hms',
      displayServiceProviderLogo: true,
      path: FinancePaths.FinanceLoans,
    },
  ],
  icon: {
    icon: 'cellular',
  },
}
