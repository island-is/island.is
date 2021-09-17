import { createStore } from '@island.is/shared/mocking'
import { fasteign, assetDetail } from './factories'

export const store = createStore(() => {
  const fasteignir = fasteign.list(5)

  const getFasteignir = {
    fasteignir: fasteignir,
    paging: {
      page: 2,
      pageSize: 5,
      total: 20,
      totalPages: 4,
      offset: 10,
      hasPreviousPage: true,
      hasNextPage: false,
    },
  }

  const detailRealEstateAssets = fasteignir.map((eign) => ({
    ...assetDetail({ fasteignanumer: eign.fasteignanumer }),
    ...eign,
  }))

  return {
    getFasteignir,
    detailRealEstateAssets,
  }
})
