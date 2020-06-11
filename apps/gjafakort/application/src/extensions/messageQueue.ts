import express from 'express'

import MessageQueue, { RoutingKey } from '@island.is/message-queue'

import { environment } from '../environments'

const { production } = environment

const APPLICATION_EXCHANGE = 'gjafakort-application-updates'

const setupMessageQueue = (app: express.Application) => {
  const channel = MessageQueue.connect(production)
  channel.declareExchange({ name: APPLICATION_EXCHANGE }).then((exchangeId) => {
    const publishToQueue = (application, type: string, state: string) => {
      channel.publish({
        exchangeId,
        message: application,
        routingKey: `${type}:${state}` as RoutingKey,
      })
    }
    app.set('publishToQueue', publishToQueue)
  })
}

export default setupMessageQueue
