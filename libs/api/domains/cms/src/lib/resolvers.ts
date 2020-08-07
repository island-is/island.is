import { Resolvers } from '@island.is/api/schema'
import {
  getNamespace,
  getVidspyrnaItem,
  getVidspyrnaItems,
  getVidspyrnaFrontpage,
} from './services'

export const resolvers: Resolvers = {
  Query: {
    getNamespace(_, { input }) {
      return getNamespace(input?.namespace ?? '', input?.lang ?? 'is-IS')
    },
    getVidspyrnaFrontpage(_, { input }) {
      return getVidspyrnaFrontpage(input?.lang ?? 'is-IS')
    },
    getVidspyrnaItems(_, { input }) {
      return getVidspyrnaItems(input?.lang ?? 'is-IS')
    },
    getVidspyrnaItem(_, { input }) {
      return getVidspyrnaItem(input?.slug ?? '', input?.lang ?? 'is-IS')
    },
  },

  Slice: {
    __resolveType: (obj) => obj.__typename,
  },
}

export default resolvers
