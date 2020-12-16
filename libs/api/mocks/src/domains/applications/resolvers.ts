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
    getApplicationsByApplicant: (parent, args) => {
      return store.applications.filter(
        (a) => a.typeId === args.typeId && a.applicant === '0000000000',
      )
    },
    getApplication: (parent, args) => {
      return store.applications.find((a) => a.id === args.input.id) || null
    },
  },
}
