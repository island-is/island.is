import { CatalogItem } from '@island.is/clients/charge-fjs-v2'

export type CatalogItemWithQuantity = CatalogItem & {
  quantity: number
  reference?: string
}

export enum FjsPaymentMethod {
  CARD = 'CARD',
  CLAIM = 'CLAIM',
  TRANSFER = 'TRANSFER', // not supported yet
}
