import { Application } from 'express'
import { sentry } from 'graphql-middleware-sentry'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
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
            graphql: rc.operation.operation || 'parse_err',
            graphqlName: rc.operationName || rc.request.operationName,
          })

          rc.errors.forEach((error) => {
            if (error.path || error.name !== 'GraphQLError') {
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
