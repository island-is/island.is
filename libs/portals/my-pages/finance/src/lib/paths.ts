export enum FinancePaths {
  FinanceRoot = '/fjarmal',
  FinanceStatus = '/fjarmal/stada',
  FinanceTransactions = '/fjarmal/faerslur',
  FinanceTransactionCategories = '/fjarmal/faerslur/flokkar',

  // If updated, also update `LinkFinanceTransactionVehicleMileage` in the assets paths file (libs/portals/my-pages/assets/src/lib/paths.ts)
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

  // LINKS
  // If updated, also update `AssetsVehiclesBulkMileage` in the assets paths file (libs/portals/my-pages/assets/src/lib/paths.ts)
  LinkAssetsVehiclesBulkMileage = '/eignir/okutaeki/skra-kilometrastodu',

  // Deprecated with redirects
  FinanceBills = '/fjarmal/greidslusedlar-og-greidslukvittanir',
  FinanceSchedule = '/fjarmal/greidsluaetlanir',
}
