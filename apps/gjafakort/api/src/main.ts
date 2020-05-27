import express from 'express'
import cookieParser from 'cookie-parser'

import { authRoutes, resolvers, typeDefs } from './domains'
import { createServer } from './graphql'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoutes)

createServer(resolvers, typeDefs)
  .then((graphQLServer) => {
    graphQLServer.applyMiddleware({ app, path: '/api' })

    const port = process.env.port || 3333
    app
      .listen(port, () => {
        console.log(`Listening at http://localhost:${port}/api`)
      })
      .on('error', console.error)
  })
  .catch((e) => console.error(e))
