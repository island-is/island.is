import {
  GjafakortUserApplicationMessage,
  GjafakortUserApplicationRoutingKey,
  GjafakortApplicationExchange,
} from '@island.is/message-queue'
import { logger } from '@island.is/logging'

import { RoutingKeyError } from './errors'
import { yayApi } from './api'

export const exchangeName: GjafakortApplicationExchange =
  'gjafakort-application-updates'

export const routingKeys: GjafakortUserApplicationRoutingKey[] = [
  'gjafakort-user:pending',
]

export const queueName = 'gjafakort-yay-user-application'

export const handler = async (
  message: GjafakortUserApplicationMessage,
  routingKey: GjafakortUserApplicationRoutingKey,
) => {
  logger.debug(
    `receiving message ${message.id} on ${queueName} with routingKey ${routingKey}`,
    message,
  )

  if (routingKey === 'gjafakort-user:pending') {
    await yayApi.createUser(message)
    await yayApi.createGiftCard(message)
  } else {
    throw new RoutingKeyError(queueName, routingKey)
  }

  logger.info(
    `Successfully processed message ${message.id} on ${queueName} with routingKey ${routingKey}`,
  )
}
