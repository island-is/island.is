import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  getUserType = 'getUserType',
  submitApplication = 'submitApplication',
}

export const CARETAKER = 'Skoðunarmaður'
export const BOARDMEMEBER = 'Stjórnarmaður'

export const YES = 'yes'
export const NO = 'no'
export const GREATER = 'greater'
export const LESS = 'less'
export const TOTAL = 'total'
export const ELECTIONLIMIT = 550000
export const INPUTCHANGEINTERVAL = 300
export const UPDATE_ELECTION_ACTION = 'updateCurrentElection'

export enum USERTYPE {
  INDIVIDUAL = 150000000,
  PARTY = 150000001,
  CEMETRY = 150000002,
}

export const BACKYEARSLIMITFALLBACK = '1'

export const INDIVIDUAL = 'individual'
export const PARTY = 'party'
export const CEMETRY = 'cemetery'

// error helpers
export const VALIDATOR = 'validator'
export const APPLICANTASMEMBER = 'applicantasmember'
export const ACTORASCARETAKER = 'actorascaretaker'
export const ACTORLONEBOARDMEMBER = 'actorloneboardmember'

// input ids
export const INDIVIDUALOPERATIONIDS = {
  incomePrefix: 'individualIncome',
  expensePrefix: 'individualExpense',
  contributionsByLegalEntities: 'individualIncome.contributionsByLegalEntities',
  individualContributions: 'individualIncome.individualContributions',
  candidatesOwnContributions: 'individualIncome.candidatesOwnContributions',
  otherIncome: 'individualIncome.otherIncome',
  capitalIncome: 'individualIncome.capitalIncome',
  electionOffice: 'individualExpense.electionOffice',
  advertisements: 'individualExpense.advertisements',
  travelCost: 'individualExpense.travelCost',
  otherCost: 'individualExpense.otherCost',
  capitalCost: 'individualExpense.capitalCost',
  totalIncome: 'individualIncome.total',
  totalExpense: 'individualExpense.total',
}

export const PARTYOPERATIONIDS = {
  incomePrefix: 'partyIncome',
  expensePrefix: 'partyExpense',
  contributionsFromTheTreasury: 'partyIncome.contributionsFromTheTreasury',
  parliamentaryPartySupport: 'partyIncome.parliamentaryPartySupport',
  municipalContributions: 'partyIncome.municipalContributions',
  contributionsFromLegalEntities: 'partyIncome.contributionsFromLegalEntities',
  contributionsFromIndividuals: 'partyIncome.contributionsFromIndividuals',
  generalMembershipFees: 'partyIncome.generalMembershipFees',
  capitalIncome: 'partyIncome.capitalIncome',
  otherIncome: 'partyIncome.otherIncome',
  totalIncome: 'partyIncome.total',
  electionOffice: 'partyExpense.electionOffice',
  otherCost: 'partyExpense.otherCost',
  capitalCost: 'partyExpense.capitalCost',
  totalExpense: 'partyExpense.total',
}

export const CEMETRYOPERATIONIDS = {
  prefixIncome: 'cemetryIncome',
  prefixExpense: 'cemetryExpense',
  incomeLimit: 'cemetryOperation.incomeLimit',
  applicationType: 'cemetryIncome.applicationType',
  careIncome: 'cemetryIncome.careIncome',
  burialRevenue: 'cemetryIncome.burialRevenue',
  grantFromTheCemeteryFund: 'cemetryIncome.grantFromTheCemeteryFund',
  capitalIncome: 'cemetryIncome.capitalIncome',
  otherIncome: 'cemetryIncome.otherIncome',
  totalIncome: 'cemetryIncome.total',
  totalOperation: 'cemetryRunningCost.totalOperation',
  totalExpense: 'cemetryExpense.total',
  payroll: 'cemetryExpense.payroll',
  funeralCost: 'cemetryExpense.funeralCost',
  chapelExpense: 'cemetryExpense.chapelExpense',
  donationsToCemeteryFund: 'cemetryExpense.cemeteryFundExpense',
  donationsToOther: 'cemetryExpense.donationsToOther',
  otherOperationCost: 'cemetryExpense.otherOperationCost',
  depreciation: 'cemetryExpense.depreciation',
}

export const CAPITALNUMBERS = {
  capitalPrefix: 'capitalNumbers',
  capitalIncome: 'capitalNumbers.capitalIncome',
  capitalCost: 'capitalNumbers.capitalCost',
  total: 'capitalNumbers.total',
}

export const CEMETRYCARETAKER = {
  caretaking: 'cemetryCaretaker.caretaking',
  nationalId: 'cemetryCaretaker.nationalId',
  name: 'cemetryCaretaker.name',
  role: 'cemetryCaretaker.role',
}

export const ABOUTIDS = {
  operatingYear: 'conditionalAbout.operatingYear',
  applicationType: 'conditionalAbout.applicationType',
  selectElection: 'election.selectElection',
  electionName: 'election.electionName',
  incomeLimit: 'election.incomeLimit',
  powerOfAttorneyNationalId: 'about.powerOfAttorneyNationalId',
  powerOfAttorneyName: 'about.powerOfAttorneyName',
}

export const OPERATINGCOST = {
  total: 'operatingCost.total',
}

export const EQUITIESANDLIABILITIESIDS = {
  assetPrefix: 'asset',
  currentAssets: 'asset.currentAssets',
  fixedAssetsTotal: 'asset.fixedAssetsTotal',
  assetTotal: 'asset.total',
  liabilityPrefix: 'liability',
  longTerm: 'liability.longTerm',
  shortTerm: 'liability.shortTerm',
  asset: 'liability.asset',
  totalLiability: 'liability.total',
  operationResult: 'equity.operationResult',
  equityPrefix: 'equity',
  totalEquity: 'equity.totalEquity',
  totalCash: 'equity.total',
  totalEquityAndLiabilities: 'equityAndLiabilities.total',
}

export const CEMETRYEQUITIESANDLIABILITIESIDS = {
  assetPrefix: 'cemetryAsset',
  liabilityPrefix: 'cemetryLiability',
  equityPrefix: 'cemetryEquity',
  currentAssets: 'cemetryAsset.currentAssets',
  fixedAssetsTotal: 'cemetryAsset.fixedAssetsTotal',
  assetTotal: 'cemetryAsset.total',
  longTerm: 'cemetryLiability.longTerm',
  shortTerm: 'cemetryLiability.shortTerm',
  liabilityTotal: 'cemetryLiability.total',
  equityAtTheBeginningOfTheYear: 'cemetryEquity.equityAtTheBeginningOfTheYear',
  revaluationDueToPriceChanges: 'cemetryEquity.revaluationDueToPriceChanges',
  reevaluateOther: 'cemetryEquity.reevaluateOther',
  operationResult: 'cemetryEquity.operationResult',
  equityTotal: 'cemetryEquity.total',
  totalEquityAndLiabilities: 'equityAndLiabilities.total',
}
