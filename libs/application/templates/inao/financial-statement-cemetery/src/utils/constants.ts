export const CEMETERYCARETAKER = {
  nationalId: 'cemeteryCaretaker.nationalId',
  name: 'cemeteryCaretaker.name',
  role: 'cemeteryCaretaker.role',
}

export const CARETAKER = 'Skoðunarmaður'
export const BOARDMEMEBER = 'Stjórnarmaður'
export const PartiesBackwardLimit = 'PartiesBackwardLimit'
export const CemeteriesBackwardLimit = 'CemeteriesBackwardLimit'
export const PartiesYearAllowed = 'PartiesYearAllowed'
export const CemeteriesYearAllowed = 'CemeteriesYearAllowed'

export enum TaxInfoTypes {
  CARE_INCOME = 300,
  BURIAL_REVENUE = 301,
  GRANT_FROM_THE_CEMETERY_FUND = 302,
}

export const CEMETERYOPERATIONIDS = {
  prefixIncome: 'cemeteryIncome',
  prefixExpense: 'cemeteryExpense',
  incomeLimit: 'cemeteryOperation.incomeLimit',
  applicationType: 'cemeteryIncome.applicationType',
  careIncome: 'cemeteryIncome.careIncome',
  burialRevenue: 'cemeteryIncome.burialRevenue',
  grantFromTheCemeteryFund: 'cemeteryIncome.grantFromTheCemeteryFund',
  capitalIncome: 'cemeteryIncome.capitalIncome',
  otherIncome: 'cemeteryIncome.otherIncome',
  totalIncome: 'cemeteryIncome.total',
  totalOperation: 'cemeteryRunningCost.totalOperation',
  totalExpense: 'cemeteryExpense.total',
  payroll: 'cemeteryExpense.payroll',
  funeralCost: 'cemeteryExpense.funeralCost',
  chapelExpense: 'cemeteryExpense.chapelExpense',
  donationsToCemeteryFund: 'cemeteryExpense.cemeteryFundExpense',
  donationsToOther: 'cemeteryExpense.donationsToOther',
  otherOperationCost: 'cemeteryExpense.otherOperationCost',
  depreciation: 'cemeteryExpense.depreciation',
}

export const CEMETERYEQUITIESANDLIABILITIESIDS = {
  assetPrefix: 'cemeteryAsset',
  liabilityPrefix: 'cemeteryLiability',
  equityPrefix: 'cemeteryEquity',
  currentAssets: 'cemeteryAsset.currentAssets',
  fixedAssetsTotal: 'cemeteryAsset.fixedAssetsTotal',
  assetTotal: 'cemeteryAsset.total',
  longTerm: 'cemeteryLiability.longTerm',
  shortTerm: 'cemeteryLiability.shortTerm',
  liabilityTotal: 'cemeteryLiability.total',
  equityAtTheBeginningOfTheYear: 'cemeteryEquity.equityAtTheBeginningOfTheYear',
  revaluationDueToPriceChanges: 'cemeteryEquity.revaluationDueToPriceChanges',
  reevaluateOther: 'cemeteryEquity.reevaluateOther',
  operationResult: 'cemeteryEquity.operationResult',
  equityTotal: 'cemeteryEquity.total',
  totalEquityAndLiabilities: 'equityAndLiabilities.total',
}
