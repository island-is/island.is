export enum Constituencies {
  NORTH_EAST = 'Norðausturkjördæmi',
  NORTH_WEST = 'Norðvesturkjördæmi',
  RVK_NORTH = 'Reykjavíkurkjördæmi norður',
  RVK_SOUTH = 'Reykjavíkurkjördæmi suður',
  SOUTH = 'Suðurkjördæmi',
  SOUTH_WEST = 'Suðvesturkjördæmi',
}

export interface Endorsement {
  date: string
  name: string
  nationalId: string
  address: {
    city: string
    postalCode: number
    streetAddress: string
  }
  hasWarning?: boolean
  id: string
}