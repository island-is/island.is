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

export enum Status {
  TEMPORARY = 'Temporary',
  PERMANENT = 'Permanent',
}

export enum Plate {
  A = 'A',
  B = 'B',
  D = 'D',
}
