import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Mutation: {
    addUserProfileDeviceToken: () => {
      return store.userProfileDeviceToken
    },
  },
}
