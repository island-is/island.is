import express from 'express'

import { logger } from '@island.is/logging'

import { startConsumers } from './consumers'
;(async () => {
  const consumers = await startConsumers()
  logger.info('All consumers have been started')

  const app = express()
  app.get('/', (req, res) => {
    if (consumers.map((consumer) => consumer.isRunning).every(Boolean)) {
      res.send({ message: 'All consumers are running' })
    } else {
      res.status(500).send({ message: 'Not all consumers are running' })
    }
  })

  const port = process.env.port || 7777
  const server = app.listen(port, () => {
    logger.info(`Listening at http://localhost:${port}`)
  })
  server.on('error', logger.error)
})().catch((err) => {
  logger.error(err)
})
