import {
  AccessCategory,
  DataCategory,
  PricingCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'

export interface Service {
  id: string
  name: string
  description: string
  owner: string
  url: string
  pricing: PricingCategory
  data: Array<DataCategory>
  type: TypeCategory
  access: Array<AccessCategory>
  created: Date
  updated: Date
}
