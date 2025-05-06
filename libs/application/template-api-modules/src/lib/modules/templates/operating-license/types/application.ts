export type Info = {
  email: string
  phoneNumber: string
  vskNr: string
  operationName: string
}

export enum OperationCategory {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
}

export enum ApplicationTypes {
  HOTEL = 'hotel',
  RESTURANT = 'resturant',
}

export type Operation = {
  operation: ApplicationTypes
  category: OperationCategory | OperationCategory[] | undefined
  typeHotel?: string
  typeResturant?: string[]
  willServe?: string
}

export enum CATEGORIES {
  RESTURANT_TWO = 'Flokkur II',
  RESTURANT_THREE = 'Flokkur III',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  HOTEL = 'Flokkur II',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
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
