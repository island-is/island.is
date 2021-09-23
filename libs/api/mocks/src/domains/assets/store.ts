import { createStore } from '@island.is/shared/mocking'
import {
  fasteign,
  assetDetail,
  paginatedThinglystirEigendur,
  paginatedUnitsOfUse,
  pagingData,
} from './factories'

export const store = createStore(() => {
  const fasteignir = fasteign.list(5)

  const getFasteignir = (hasNextPage = true) => ({
    fasteignir: hasNextPage ? fasteignir : fasteign.list(5),
    paging: pagingData({ hasNextPage }),
  })

  const detailRealEstateAssets = fasteignir.map((eign) => ({
    ...assetDetail({ fasteignanumer: eign.fasteignanumer }),
    ...eign,
  }))

  const pagedThinglystirEigendur = (hasNextPage?: boolean) =>
    paginatedThinglystirEigendur(hasNextPage)

  const pagedUnitsOfUse = (hasNextPage?: boolean) =>
    paginatedUnitsOfUse(hasNextPage)

  return {
    getFasteignir,
    detailRealEstateAssets,
    pagedThinglystirEigendur,
    pagedUnitsOfUse,
  }
})
