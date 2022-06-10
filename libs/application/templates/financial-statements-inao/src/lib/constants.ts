import { DefaultEvents } from '@island.is/application/core'

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
  otherIncome: 'income.other',
  personal: 'income.personal',
  capitalIncome: 'income.capitalIncome',
  capital: 'incomeAndExpenses.capital',
  partyRunning: 'expenses.partyRunning',
}
