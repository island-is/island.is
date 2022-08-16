import { string } from 'zod'

export type Info = {
  email: string
  phoneNumber: string
  vskNr: string
  operationName: string
}

export type Properties = {
  address: string
  spaceNumber: string
  customerCount: string
  propertyNumber: string
}

export type OpeningHour = {
  from: string
  to: string
}

export type OpeningHours = {
  alcohol: {
    weekdays: OpeningHour
    weekends: OpeningHour
  }
  willServe: string[]
  outside?: {
    weekdays: OpeningHour
    weekends: OpeningHour
  }
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
  RESTURANT_TWO = 'veitingastaður í flokki II',
  RESTURANT_THREE = 'veitingastaðu í flokki III',
  HOTEL = 'gististaðar án veitinga',
  HOTEL_ALCOHOL = 'gististaðar með áfengisveitingum',
  HOTEL_FOOD = 'gististaðar með veitingum, en án áfengisveitinga',
}

export type Rymi = {
  stadur: string
  fasteignanumer: string
  rymisnumer: string
  hamarksfjoldiGesta: string
}
export type ExtraData = {
  kallast: string
  tegund: string
  tegund2: string
  tegundReksturs: string
  flokkur: string
  leyfiTilUtiveitinga: string
  afgrAfgengisVirkirdagar: string
  afgrAfgengisAdfaranottFridaga: string
  afgrAfgengisVirkirdagarUtiveitingar: string | null
  afgrAfgengisAdfaranottFridagaUtiveitingar: string | null
  netfang: string
  simanumer: string
  rymi: string
  bradabirgdarleyfi: string
  skuldastada: string
  annad: string
}
