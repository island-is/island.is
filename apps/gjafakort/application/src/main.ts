import express from 'express'

import { logger } from '@island.is/logging'

import { issuerRoutes, applicationRoutes } from './api'

const app = express()

app.use(express.json())
app.use('/issuers', issuerRoutes)
app.use('/applications', applicationRoutes)

app.get('/status', (req, res) => {
  res.json({ ok: true })
})

const port = process.env.port || 4242
const server = app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}`)
})
server.on('error', logger.error)
