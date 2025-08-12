import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Identity: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __resolveType: (identity) => {
      return identity.type === 'Company' ? 'IdentityCompany' : 'IdentityPerson'
    },
  },
  Query: {
    identity: (_, { input }) => {
      return (
        store.identities.find(
          (identity) => identity.nationalId === input?.nationalId,
        ) ?? null
      )
    },
  },
}
