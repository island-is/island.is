export type Client = {
  label: string
  value: string
}

export type Election = {
  electionId: string
  name: string
  electionDate: Date
}

export type FinancialType = {
  numericValue: number
  financialTypeId: string
}

export type KeyValue = {
  key: number
  value: number
}

export type Config = {
  key: string
  value: number
}

export enum ClientTypes {
  Individual = 150000000,
  PoliticalParty = 150000001,
  Cemetery = 150000002,
}
