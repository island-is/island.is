import { Resolvers, UserProfile } from '../../types'
import { store } from './store'
import { getUserProfileFactory } from './factories'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    getUserProfile: () => {
      return store.getUserProfile
    },
  },
  Mutation: {
    updateProfile: (parent, args: any) => {
      const updatedUser = getUserProfileFactory(args.input)
      store.getUserProfile = {
        ...store.getUserProfile,
        ...updatedUser,
      }
      return updatedUser
    },
    createProfile: (parent, args: any) => {
      const updatedUser = getUserProfileFactory(args.input)
      store.getUserProfile = {
        ...store.getUserProfile,
        ...updatedUser,
      }
      return updatedUser
    },
    createEmailVerification: () => {
      return {
        created: true,
      }
    },
    createSmsVerification: () => {
      return {
        created: true,
      }
    },
    deleteIslykillValue: (parent, args: any) => {
      const userObject: UserProfile = {
        ...store.getUserProfile,
        ...(args.input.email && {
          email: undefined,
          emailStatus: 'EMPTY',
        }),
        ...(args.input.mobilePhoneNumber && {
          mobilePhoneNumber: undefined,
          mobileStatus: 'EMPTY',
        }),
      }
      store.getUserProfile = userObject
      return userObject
    },
  },
}
