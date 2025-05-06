import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    assetsPropertyOwners: (_, { input }) => {
      const cursor = input.cursor ? parseInt(input.cursor, 20) : 1
      return cursor && cursor > 1
        ? store.pagedConfirmedOwners(false)
        : store.pagedConfirmedOwners()
    },
    assetsUnitsOfUse: (_, { input }) => {
      const cursor = input.cursor ? parseInt(input.cursor, 20) : 1
      return cursor && cursor > 1
        ? store.pagedUnitsOfUse(false)
        : store.pagedUnitsOfUse()
    },
    assetsDetail: (_, { input }) => {
      const match = store.detailRealEstateAssets.find(
        (item) => item.propertyNumber === input.assetId,
      )
      return match || null
    },
    assetsOverview: (_, { input }) => {
      const cursor = input.cursor ? parseInt(input.cursor, 20) : 1
      return cursor && cursor > 1
        ? store.getProperties(false)
        : store.getProperties()
    },
  },
}
