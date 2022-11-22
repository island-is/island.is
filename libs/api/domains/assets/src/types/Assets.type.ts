import { Pagination } from '@island.is/clients/assets'

export interface DefaultAddress {
  displayShort?: string | null
  display?: string | null
  propertyNumber?: number
  municipality?: string | null
  postNumber?: number | null
  locationNumber?: number | null
}

export interface PropertiesSimple {
  propertyNumber?: string | null
  defaultAddress?: DefaultAddress | null
}

export interface PropertiesDTO {
  paging?: Pagination | null
  properties?: Array<PropertiesSimple> | null
}
