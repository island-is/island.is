import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },
  Query: {
    getUserProfile: (parent, args) => {
      if (store.profile.locale === '') return null
      return store.profile
    },
  },
  Mutation: {
    createProfile: (parent, args) => {
      if (args.input.email) store.profile.email = args.input.email
      if (args.input.locale) store.profile.locale = args.input.locale
      if (args.input.mobilePhoneNumber)
        store.profile.mobilePhoneNumber = args.input.mobilePhoneNumber
      store.profile.mobilePhoneNumberVerified = true

      return store.profile
    },
    updateProfile: (parent, args) => {
      if (args.input.email) store.profile.email = args.input.email
      if (args.input.locale) store.profile.locale = args.input.locale
      if (args.input.mobilePhoneNumber)
        store.profile.mobilePhoneNumber = args.input.mobilePhoneNumber

      return store.profile
    },
    createSmsVerification: (parent, args) => {
      return Promise.resolve({ created: true })
    },
    confirmSmsVerification: (parent, args) => {
      store.profile.mobilePhoneNumberVerified = true
      return Promise.resolve({ confirmed: true, message: '' })
    },
    confirmEmailVerification: (parent, args) => {
      store.profile.emailVerified = true
      return Promise.resolve({ confirmed: true, message: '' })
    },
  },
}
