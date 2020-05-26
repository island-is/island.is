import express from 'express'
import MsgQueue from '@island.is/message-queue'
import createGraphqlServer from './graphql'
import { environment } from './environments/environment'
import { Context } from './types'
;(async () => {
  const { production, applicationExchange } = environment

  const app = express()

  app.get('/', (req, res) => {
    res.send({ message: 'Hello, I am a liveness probe' })
  })

  const channel = await MsgQueue.connect(production)
  const appExchangeId = await channel.declareExchange({
    name: applicationExchange,
  })
  const context: Context = {
    channel,
    appExchangeId,
  }

  createGraphqlServer(app, context)

  const port = process.env.port || 3333
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`)
  })
  server.on('error', console.error)
})().catch((err) => {
  console.error(err)
})
