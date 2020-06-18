import { Application } from 'express'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import * as Sentry from '@sentry/node'

import { environment } from '../environments'

const {
  sentry: { dsn },
  ferdalag,
} = environment

Sentry.init({
  dsn,
  environment: 'api',
  beforeBreadcrumb: (breadCrumb) => {
    // Strip ferdalag apikey from breadcrumb
    if (breadCrumb.data.url.startsWith(ferdalag.url)) {
      const [strippedUrl] = breadCrumb.data.url.split('?')
      return {
        ...breadCrumb,
        data: {
          ...breadCrumb.data,
          url: strippedUrl,
        },
      }
    }
    return breadCrumb
  },
})

export const setupRequestHandler = (app: Application) => {
  app.use(Sentry.Handlers.requestHandler())
}

export const setupErrorHandler = (app: Application) => {
  app.use(Sentry.Handlers.errorHandler())
}

export const apolloServerPlugin = {
  requestDidStart() {
    return {
      didEncounterErrors(rc) {
        Sentry.withScope((scope) => {
          const ssn = rc.context.user?.ssn
          if (ssn) {
            scope.setUser({
              ssn,
            })
          }

          scope.setTags({
            graphql: rc.operation?.operation || 'parse_err',
            graphqlName: rc.operationName || rc.request.operationName,
          })

          rc.errors.forEach((error) => {
            if (
              ['FORBIDDEN', 'UNAUTHENTICATED'].includes(error.extensions?.code)
            ) {
              return
            } else if (error.path || error.name !== 'GraphQLError') {
              scope.setExtras({
                path: error.path,
              })
              Sentry.captureException(error)
            } else {
              scope.setExtras({})
              Sentry.captureMessage(`GraphQLWrongQuery: ${error.message}`)
            }
          })
        })
      },
    }
  },
} as ApolloServerPlugin
