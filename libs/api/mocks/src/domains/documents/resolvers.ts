import orderBy from 'lodash/orderBy'
import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    listDocuments: (parent, args) => {
      return store.documents
    },
    getDocument: (parent, args) => {
      const doc = store.detail()
      return doc
    },
  },
}
