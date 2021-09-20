import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    getRealEstates: () => store.getFasteignir,
    getThinglystirEigendur: () => store.pagedThinglystirEigendur,
    getRealEstateDetail: (_, { input }) => {
      const match = store.detailRealEstateAssets.find(
        (item) => item.fasteignanumer === input.assetId,
      )
      return match ? match : null
    },
  },
}
