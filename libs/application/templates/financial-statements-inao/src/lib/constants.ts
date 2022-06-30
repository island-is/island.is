import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
}
export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  getUserClientType = 'getUserClientType',
}

export const GREATER = 'greater'
export const LESS = 'less'

export const OPERATIONIDS = {
  corporateDonations: 'income.corporateDonations',
  individualDonations: 'income.individualDonations',
  personalDonations: 'income.personalDonations',
  otherIncome: 'income.otherIncome',
  capitalIncome: 'income.capitalIncome',
  electionOffice: 'expense.electionOffice',
  advertisements: 'expense.advertisements',
  travelCost: 'expense.travelCost',
  otherCost: 'expense.otherCost',
  capitalCost: 'expense.capitalCost',
}

export const PARTYOPERATIONIDS = {
  applicationType: 'income.applicationType',
  publicDonations: 'income.publicDonations',
  partyDonations: 'income.partyDonations',
  municipalityDonations: 'income.municipalityDonations', 
  corporateDonations: 'income.corporateDonations',
  individualDonations: 'income.individualDonations',
  capitalIncome: 'income.capitalIncome',
  otherIncome: 'income.otherIncome',
  electionOffice: 'expense.electionOffice',
  otherCost: 'expense.otherCost',
  capitalCost: 'expense.capitalCost',
}

export const CEMETRYOPERATIONIDS = {
  prefixIncome: 'cemetryIncome',
  prefixExpense: 'cemetryExpense',
  applicationType: 'cemetryIncome.applicationType',
  caretaking: 'cemetryIncome.caretaking',
  graveIncome: 'cemetryIncome.graveIncome',
  cemetryFundDonations: 'cemetryIncome.cemetryFundDonations',
  capitalIncome: 'cemetryIncome.capitalIncome',
  otherIncome: 'cemetryIncome.otherIncome',
  payroll: 'cemetryExpense.payroll',
  funeralCost: 'cemetryExpense.funeralCost',
  chapelExpense: 'cemetryExpense.chapelExpense',
  cemeteryFundExpense: 'cemetryExpense.cemeteryFundExpense',
  donationsToOther: 'cemetryExpense.donationsToOther',
  otherOperationCost: 'cemetryExpense.otherOperationCost',
  writtenOffExpense: 'cemetryExpense.writtenOffExpense',
}

export const ABOUTIDS = {
  operatingYear: 'conditionalAbout.operatingYear',
  applicationType: 'conditionalAbout.applicationType',
}

export const EQUITIESANDLIABILITIESIDS = {
  tangible: 'asset.tangible',
  current: 'asset.current',
  assetTotal: 'asset.total',
  longTerm: 'liability.longTerm',
  shortTerm: 'liability.shortTerm',
  equity: 'equity.totalEquity',
}

export const CEMETRYEQUITIESANDLIABILITIESIDS = {
  assetPrefix: 'cemetryAsset',
  liabilityPrefix: 'cemetryLiability',
  equityPrefix: 'cemetryEquity',
  tangible: 'cemetryAsset.tangible',
  current: 'cemetryAsset.current',
  assetTotal: 'cemetryAsset.total',
  longTerm: 'cemetryLiability.longTerm',
  shortTerm: 'cemetryLiability.shortTerm',
  liabilityTotal: 'cemetryLiability.total',
  newYearEquity: 'cemetryEquity.newYearEquity',
  reevaluatePrice: 'cemetryEquity.reevaluatePrice',
  reevaluateOther: 'cemetryEquity.reevaluateOther',
  operationResult: 'cemetryEquity.operationResult',
  equityTotal: 'cemetryEquity.equityTotal',
}

export const INDIVIDUAL = 'individual'
export const PARTY = 'party'
export const CEMETRY = 'cemetery'
