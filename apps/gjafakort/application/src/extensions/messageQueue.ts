import express from 'express'

import MessageQueue from '@island.is/message-queue'
import { ApplicationExchange } from '@island.is/gjafakort/types'

import { environment } from '../environments'

const { production } = environment

const APPLICATION_EXCHANGE: ApplicationExchange = 'gjafakort-application-updates'

const setupMessageQueue = (app: express.Application) => {
  const channel = MessageQueue.connect(production)
  channel.declareExchange({ name: APPLICATION_EXCHANGE }).then((exchangeId) => {
    const publishToQueue = (application, type: string, state: string) => {
      channel.publish({
        exchangeId,
        message: application,
        routingKey: `${type}:${state}`,
      })
    }
    app.set('publishToQueue', publishToQueue)
  })
}

export default setupMessageQueue
