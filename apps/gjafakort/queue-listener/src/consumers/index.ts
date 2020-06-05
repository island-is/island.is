import MsgQueue from '@island.is/message-queue'
import { logger } from '@island.is/logging'

import { environment } from '../environments'
import handlers from './handlers'

const { production } = environment

export const startConsumers = async () => {
  const channel = MsgQueue.connect(production)

  return Promise.all(
    handlers.map(async (handler) => {
      const exchangeId = await channel.declareExchange({
        name: handler.exchangeName,
      })
      const queueId = await channel.declareQueue({ name: handler.queueName })
      const dlQueueName = `${handler.queueName}-deadletter`
      const dlQueueId = await channel.declareQueue({ name: dlQueueName })
      await channel.setDlQueue({ queueId, dlQueueId })
      await channel.bindQueue({
        queueId,
        exchangeId,
        routingKeys: handler.routingKeys,
      })

      const consumer = channel.consume({ queueId, handler: handler.handler })
      logger.info(`Listening on queue ${handler.queueName}`)
      return consumer
    }),
  )
}
