import { CatalogItem } from '@island.is/clients/charge-fjs-v2'

export type CatalogItemWithQuantity = CatalogItem & { quantity: number }
