import {
  GjafakortCompanyApplicationMessage,
  GjafakortCompanyApplicationRoutingKey,
  GjafakortApplicationExchange,
} from '@island.is/message-queue'
import { logger } from '@island.is/logging'

import { RoutingKeyError } from './errors'
import { yayApi } from './api'

export const exchangeName: GjafakortApplicationExchange =
  'gjafakort-application-updates'

export const routingKeys: GjafakortCompanyApplicationRoutingKey[] = [
  'gjafakort:approved',
  'gjafakort:pending',
  'gjafakort:rejected',
]

export const queueName = 'gjafakort-yay-company-application'

export const handler = async (
  message: GjafakortCompanyApplicationMessage,
  routingKey: GjafakortCompanyApplicationRoutingKey,
) => {
  logger.debug(
    `receiving message ${message.id} on ${queueName} with routingKey ${routingKey}`,
    message,
  )

  if (
    routingKey === 'gjafakort:approved' ||
    routingKey === 'gjafakort:pending'
  ) {
    await yayApi.createCompany(message)
  } else if (routingKey === 'gjafakort:rejected') {
    await yayApi.rejectCompany(message)
  } else {
    throw new RoutingKeyError(queueName, routingKey)
  }

  logger.info(
    `Successfully processed message ${message.id} on ${queueName} with routingKey ${routingKey}`,
  )
}
