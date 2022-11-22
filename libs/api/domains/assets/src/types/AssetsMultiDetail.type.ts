import { Pagination } from '@island.is/clients/assets-v2'
import { PropertySingleDTO } from './AssetSingle.type'

export interface AssetsMultiDetail {
  paging?: Pagination | null
  properties?: Array<PropertySingleDTO | null> | null
}
