export type Info = {
  email: string
  phoneNumber: string
  vskNr: string
  operationName: string
}

export enum OPERATION_CATEGORY {
  ONE = '1',
  TWO = '2',
}

export enum APPLICATION_TYPES {
  HOTEL = 'hotel',
  RESTURANT = 'resturant',
}

export type Operation = {
  operation: APPLICATION_TYPES
  hotel: {
    category: OPERATION_CATEGORY | OPERATION_CATEGORY[] | undefined
    type: string
  }
  resturant: {
    category: OPERATION_CATEGORY | OPERATION_CATEGORY[] | undefined
    type: string
  }
}

export enum CATEGORIES {
  RESTURANT_TWO = 'Flokkur II',
  RESTURANT_THREE = 'Flokkur III',
  HOTEL = 'Flokkur II',
  HOTEL_FOOD = 'Flokkur III',
  HOTEL_ALCOHOL = 'Flokkur IV',
}

export type Property = {
  propertyNumber: string
  address: string
  spaceNumber: string
  customerCount: string
}
