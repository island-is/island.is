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
  HOTEL = 'gististaðar án veitinga',
  HOTEL_ALCOHOL = 'gististaðar með áfengisveitingum',
  HOTEL_FOOD = 'gististaðar með veitingum, en án áfengisveitinga',
}
