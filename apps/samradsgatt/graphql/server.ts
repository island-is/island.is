import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import type { Server } from 'http'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'

const books = [
  {
    title: 'Parable of the Sower',
    author: 'Octavia E. Butler',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
]

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`

const resolvers = {
  Query: {
    books: () => books,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
})

const app = express()

async function startApolloServer() {
  await server.start()

  server.applyMiddleware({
    app,
    path: '/testAPI',
  })

  let httpServer: Server
  await new Promise<void>(
    (resolve) => (httpServer = app.listen(0, '127.0.0.1', () => resolve())),
  )
  return { server, app, httpServer }
}

startApolloServer()
  .then(({ httpServer }) => {
    const address = httpServer.address()
    const serverUrl =
      process.env.SANDBOX_URL ??
      (typeof address === 'string'
        ? address
        : `http://${address.address}:${address.port}`)
    console.log(`🚀 Server ready at ${serverUrl}`)
  })
  .catch((err) => {
    console.error('An error occurred during `startApolloServer`:')
    console.error(err)
    process.exit(1)
  })
