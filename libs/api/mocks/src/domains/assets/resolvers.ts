import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    getThinglystirEigendur: (_, { input }) => {
      const cursor = input.cursor ? parseInt(input.cursor, 10) : 0
      return cursor && cursor > 0
        ? store.pagedThinglystirEigendur(false)
        : store.pagedThinglystirEigendur()
    },
    getNotkunareiningar: (_, { input }) => {
      const cursor = input.cursor ? parseInt(input.cursor, 10) : 0
      return cursor && cursor > 0
        ? store.pagedUnitsOfUse(false)
        : store.pagedUnitsOfUse()
    },
    getRealEstateDetail: (_, { input }) => {
      const match = store.detailRealEstateAssets.find(
        (item) => item.fasteignanumer === input.assetId,
      )
      return match || null
    },
    getRealEstates: (_, { input }) => {
      const cursor = input.cursor ? parseInt(input.cursor, 10) : 0
      return cursor && cursor > 0
        ? store.getFasteignir(false)
        : store.getFasteignir()
    },
  },
}
