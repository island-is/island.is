export type Info = {
  email: string
  phoneNumber: string
  vskNr: string
  operationName: string
}

export enum OPERATION_CATEGORY {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
}

export enum APPLICATION_TYPES {
  HOTEL = 'hotel',
  RESTURANT = 'resturant',
}

export type Operation = {
  operation: APPLICATION_TYPES
  category: OPERATION_CATEGORY | OPERATION_CATEGORY[] | undefined
  typeHotel?: string
  typeResturant?: string[]
  willServe?: string
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

export interface BankruptcyHistoryResult {
  bankruptcyStatus?: string
  caseNumber?: string
  status?: string
  outcomeDate?: string
  organizationName?: string
}
