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
    getRealEstateDetail: (_, { input }) => {
      const idMatch =
        store.getSingleRealEstateAsset.fasteignanr === input.assetId
      return idMatch ? store.getSingleRealEstateAsset : null
    },
  },
}
