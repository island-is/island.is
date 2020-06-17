import { logger } from '@island.is/logging'
import {
  ApplicationExchange,
  CompanyApplication,
  CompanyApplicationRoutingKey,
} from '@island.is/gjafakort/types'

import { RoutingKeyError } from './errors'
import { yayApi } from './api'

export const exchangeName: ApplicationExchange = 'gjafakort-application-updates'

export const routingKeys: CompanyApplicationRoutingKey[] = [
  'gjafakort:approved',
  'gjafakort:pending',
  'gjafakort:rejected',
]

export const queueName = 'gjafakort-yay-company-application'

export const handler = async (
  message: CompanyApplication,
  routingKey: CompanyApplicationRoutingKey,
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
