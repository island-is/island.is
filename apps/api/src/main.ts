import express from 'express'
import createGraphqlServer from './graphql'

const app = express()

createGraphqlServer(app)

const port = process.env.port || 4444
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/graphql`)
})
server.on('error', console.error)
