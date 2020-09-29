import {
  AccessCategory,
  DataCategory,
  PricingCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { XroadIdentifier } from './xroadIdentifier.model'

export interface Service {
  id: string
  name: string
  description: string
  owner: string
  pricing: Array<PricingCategory>
  data: Array<DataCategory>
  type: Array<TypeCategory>
  access: Array<AccessCategory>
  xroadIdentifier?: Array<XroadIdentifier>
}
