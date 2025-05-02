export enum FinancePaths {
  FinanceRoot = '/fjarmal',
  FinanceStatus = '/fjarmal/stada',
  FinanceTransactions = '/fjarmal/faerslur',
  FinanceTransactionCategories = '/fjarmal/faerslur/flokkar',
  FinanceTransactionVehicleMileage = '/fjarmal/faerslur/kilometragjald',
  FinanceTransactionPeriods = '/fjarmal/faerslur/timabil',
  FinanceEmployeeClaims = '/fjarmal/laungreidendakrofur',
  FinanceLocalTax = '/fjarmal/utsvar',
  FinanceExternal = 'https://minarsidur.island.is/minar-sidur/fjarmal/fjarmal-stada-vid-rikissjod-og-stofnanir/',
  FinanceLoans = '/fjarmal/lan',
  FinancePayments = '/fjarmal/greidslur',
  FinancePaymentsBills = '/fjarmal/greidslur/greidslusedlar-og-greidslukvittanir',
  FinancePaymentsSchedule = '/fjarmal/greidslur/greidsluaetlanir',
  FinancePaymentsHousingBenefits = '/fjarmal/greidslur/husnaedisbaetur',

  // Deprecated with redirects
  FinanceBills = '/fjarmal/greidslusedlar-og-greidslukvittanir',
  FinanceSchedule = '/fjarmal/greidsluaetlanir',
}
