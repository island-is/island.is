import express from 'express'
import { startConsumers } from './consumers'
;(async () => {
  const consumers = await startConsumers()
  console.log('All consumers have been started')

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
    console.log(`Listening at http://localhost:${port}`)
  })
  server.on('error', console.error)
})().catch((err) => {
  console.error(err)
})
