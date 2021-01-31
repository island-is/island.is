import orderBy from 'lodash/orderBy'
import { Resolvers } from '../../types'
import { store } from './store'
import { application, externalData } from './factories'

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
    nationalRegistryFamily: () => {
      return store.familyMembers
    },
  },
  Mutation: {
    createApplication: (parent, args) => {
      const newApplication = application(args.input)
      store.applications.push(newApplication)
      return newApplication
    },

    updateApplicationExternalData: (parent, args) => {
      const application = store.applications.find(
        (app) => app.id === args.input.id,
      )
      if (!application) {
        throw new Error('Missing application')
      }
      args.input.dataProviders.forEach(({ id, type }) => {
        application.externalData[id] = externalData(type)
      })
      return application
    },
  },
}
