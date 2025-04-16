import { createStore } from '@island.is/shared/mocking'
import {
  singleProperty,
  assetDetail,
  paginatedConfirmedOwners,
  paginatedUnitsOfUse,
  pagingData,
} from './factories'
import { PropertyDetail } from '../../types'

export const store = createStore(() => {
  const properties = singleProperty.list(20)

  const getProperties = (hasNextPage = true) => ({
    properties: hasNextPage ? properties : singleProperty.list(20),
    paging: pagingData({ hasNextPage }),
  })

  const detailRealEstateAssets = properties.map((item) => ({
    ...assetDetail({ propertyNumber: item.propertyNumber }),
    ...item,
  })) as PropertyDetail[]

  const pagedConfirmedOwners = (hasNextPage?: boolean) =>
    paginatedConfirmedOwners(hasNextPage)

  const pagedUnitsOfUse = (hasNextPage?: boolean) =>
    paginatedUnitsOfUse(hasNextPage)

  return {
    getProperties,
    detailRealEstateAssets,
    pagedConfirmedOwners,
    pagedUnitsOfUse,
  }
})
