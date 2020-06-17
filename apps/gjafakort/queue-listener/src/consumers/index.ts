import MsgQueue, { Channel } from '@island.is/message-queue'
import { logger } from '@island.is/logging'
import {
  ApplicationExchange,
  CompanyApplication,
  CompanyApplicationRoutingKey,
  UserApplication,
  UserApplicationRoutingKey,
} from '@island.is/gjafakort/types'

import { environment } from '../environments'
import { companyHandlers, userHandlers } from './handlers'

const { production } = environment

const setupExchangeAndQueue = async <RoutingKey>(
  channel: Channel,
  exchangeName: ApplicationExchange,
  queueName: string,
  routingKeys: RoutingKey[],
) => {
  const exchangeId = await channel.declareExchange({
    name: exchangeName,
  })
  const queueId = await channel.declareQueue({ name: queueName })
  const dlQueueName = `${queueName}-deadletter`
  const dlQueueId = await channel.declareQueue({ name: dlQueueName })
  await channel.setDlQueue({ queueId, dlQueueId })
  await channel.bindQueue<RoutingKey>({
    queueId,
    exchangeId,
    routingKeys: routingKeys,
  })
  return queueId
}

export const startConsumers = async () => {
  const channel = MsgQueue.connect(production)

  const companyConsumers = companyHandlers.map(async (handler) => {
    const queueId = await setupExchangeAndQueue<CompanyApplicationRoutingKey>(
      channel,
      handler.exchangeName,
      handler.queueName,
      handler.routingKeys,
    )
    const consumer = channel.consume<CompanyApplication, CompanyApplicationRoutingKey>({
      queueId,
      handler: handler.handler,
    })
    logger.info(`Listening on queue ${handler.queueName}`)
    return consumer
  })

  const userConsumers = userHandlers.map(async (handler) => {
    const queueId = await setupExchangeAndQueue<UserApplicationRoutingKey>(
      channel,
      handler.exchangeName,
      handler.queueName,
      handler.routingKeys,
    )
    const consumer = channel.consume<UserApplication, UserApplicationRoutingKey>({
      queueId,
      handler: handler.handler,
    })
    logger.info(`Listening on queue ${handler.queueName}`)
    return consumer
  })

  return Promise.all(companyConsumers.concat(userConsumers))
}
