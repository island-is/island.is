import cookieParser from 'cookie-parser'
import express from 'express'

import { logger } from '@island.is/logging'

import { authRoutes, resolvers, typeDefs } from './domains'
import {
  apolloServerSentryPlugin,
  setupSentryErrorHandler,
  setupSentryRequestHandler,
} from './extensions'
import { createServer } from './graphql'

const app = express()

setupSentryRequestHandler(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send({ message: 'Hello, I am a readiness probe' })
})

createServer(resolvers, typeDefs, [apolloServerSentryPlugin])
  .then((graphQLServer) => {
    graphQLServer.applyMiddleware({ app, path: '/api' })

    setupSentryErrorHandler(app)

    const port = process.env.port || 3333
    app
      .listen(port, () => {
        logger.info(`Listening at http://localhost:${port}/api`)
      })
      .on('error', logger.error)
  })
  .catch((e) => logger.error(e))
