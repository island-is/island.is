import { Pagination } from '@island.is/clients/assets'
import { PropertySingleDTO } from './AssetSingle.type'

export interface AssetsMultiDetail {
  paging?: Pagination | null
  properties?: Array<PropertySingleDTO | null> | null
}
