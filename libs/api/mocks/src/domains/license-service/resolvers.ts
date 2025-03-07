import { Resolvers } from '../../types'
import { store } from '../license-service'

export const resolvers: Resolvers = {
  Slice: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    genericLicense: (_, { input }) => {
      const license = store.getLicense(input)
      return license
    },
    genericLicenses: (_) => {
      return store.getLicenses({})
    },
    genericLicenseCollection: (_) => {
      return {
        licenses: store.getLicenses({ includePassport: true }),
      }
    },
  },
}
