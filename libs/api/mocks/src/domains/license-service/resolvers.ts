import { Resolvers } from '../../types'
import { store } from '../license-service'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    genericLicense: (_, { input, locale }) => {
      const license = store.getLicense(input)
      return license
    },
    genericLicenses: (_, { input, locale }) => {
      return store.getLicenses(input ?? undefined)
    },
  },
}
