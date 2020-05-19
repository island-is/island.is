import express from 'express'

import { authRoutes } from './api'
import createGraphqlServer from './graphql'

const app = express()

app.use(express.json())
app.use('/api/auth', authRoutes)

createGraphqlServer(app)

const port = process.env.port || 3333
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
})
server.on('error', console.error)
