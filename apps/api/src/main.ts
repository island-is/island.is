import express from 'express'
import createGraphqlServer from './graphql'

import { logger } from '@island.is/logging'

const app = express()

createGraphqlServer(app)

// answer health checks
app.get('/', (req, res) => res.sendStatus(200))

const port = process.env.PORT || 4444
const server = app.listen(port, () => {
  logger.info(`Graphql running at http://localhost:${port}/api/graphql`)
})
server.on('error', logger.error)
