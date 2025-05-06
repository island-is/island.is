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
    documentsV2: (_, { input }) => {
      const page = input.page || 1
      const pageSize = input.pageSize || 10
      if (pageSize) {
        const start = (page - 1) * pageSize
        const end = start + pageSize
        return {
          ...store.documentsV2,
          data: store.documentsV2.data.slice(start, end),
        }
      }
      return store.documentsV2
    },
    getDocumentCategories: () => {
      return store.categories
    },
    getDocumentSenders: () => {
      return store.senders
    },
  },
  Mutation: {
    postMailActionV2: (_, { input }) => {
      if (input.action === 'archive') {
        store.documentsV2.data = store.documentsV2.data.filter(
          (doc) => !input.documentIds.includes(doc.id),
        )
      }
      return {
        success: true,
        messageIds: [],
      }
    },
  },
}
