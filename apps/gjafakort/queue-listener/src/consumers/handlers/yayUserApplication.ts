import { logger } from '@island.is/logging'
import {
  ApplicationExchange,
  UserApplication,
  UserApplicationRoutingKey,
} from '@island.is/gjafakort/types'

import { RoutingKeyError } from './errors'
import { yayApi } from './api'

export const exchangeName: ApplicationExchange = 'gjafakort-application-updates'

export const routingKeys: UserApplicationRoutingKey[] = [
  'gjafakort-user:approved',
]

export const queueName = 'gjafakort-yay-user-application'

export const handler = async (
  message: UserApplication,
  routingKey: UserApplicationRoutingKey,
) => {
  logger.debug(
    `receiving message ${message.id} on ${queueName} with routingKey ${routingKey}`,
    message,
  )

  if (routingKey === 'gjafakort-user:approved') {
    await yayApi.createUser(message)
    await yayApi.createGiftCard(message)
  } else {
    throw new RoutingKeyError(queueName, routingKey)
  }

  logger.info(
    `Successfully processed message ${message.id} on ${queueName} with routingKey ${routingKey}`,
  )
}
