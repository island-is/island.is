import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    airDiscountSchemeDiscounts: () => {
      return store.airDiscounts
    },
    airDiscountSchemeUserAndRelationsFlights: () => {
      return store.flights
    },
  },
}
