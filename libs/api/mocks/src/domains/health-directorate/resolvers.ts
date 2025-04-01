import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    healthDirectorateOrganDonation: () => {
      return store.getOrganDonationStatus
    },
    healthDirectorateVaccinations: () => {
      return store.getVaccinations
    },
  },
}
