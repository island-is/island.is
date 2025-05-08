import { Resolvers } from '../../types'
import { store } from './store'
import { application, externalData } from './factories'

export const resolvers: Resolvers = {
  Slice: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    applicationApplications: () => {
      return store.applications
    },
    applicationApplication: (parent, args) => {
      return store.applications.find((a) => a.id === args.input.id) || null
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
      args.input.dataProviders.forEach(({ actionId, order }) => {
        application.externalData[actionId] = externalData(actionId)
      })
      return application
    },
  },
}
