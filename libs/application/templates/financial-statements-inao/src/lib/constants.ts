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

export const EQUITIESANDLIABILITIESIDS = {
  tangible: 'asset.tangible',
  current: 'asset.current',
  longTerm: 'liability.longTerm',
  shortTerm: 'liability.shortTerm',
  equity: 'equity.totalEquity',
}
