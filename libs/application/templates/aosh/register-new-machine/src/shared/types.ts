export type Machine = {
  id?: string
  regNumber?: string
  date?: string
  subType?: string
  type?: string
  category?: string
  plate?: string
  ownerNumber?: string
}

export type TechInfoItem = {
  variableName?: string
  label?: string
  type?: string
  required?: boolean
  maxLength?: string
  values?: string[]
}

export enum Status {
  TEMPORARY = 'Temporary',
  PERMANENT = 'Permanent',
}

export enum Plate {
  A = '1',
  B = '2',
  D = '3',
}

export const NEW = 'new'
export const USED = 'used'
