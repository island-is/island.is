import md5 from 'crypto-js/md5'

import {
  GjafakortCompanyApplicationMessage,
  GjafakortCompanyApplicationRoutingKey,
  GjafakortApplicationExchange,
} from '@island.is/message-queue'
import { logger } from '@island.is/logging'

import { environment } from '../../environments'
import { RoutingKeyError } from './errors'
import { request } from './api'

const {
  yay: { url, apiKey, secretKey },
} = environment

export const exchangeName: GjafakortApplicationExchange =
  'gjafakort-application-updates'

export const routingKeys: GjafakortCompanyApplicationRoutingKey[] = [
  'gjafakort:approved',
  'gjafakort:pending',
  'gjafakort:rejected',
]

export const queueName = 'gjafakort-yay-company-application'

const getHeaders = () => {
  const timestamp = new Date().toISOString()
  return {
    ApiKey: apiKey,
    'X-Timestamp': timestamp,
    'X-Signature': md5(`${apiKey}-${secretKey}-${timestamp}`),
  }
}

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
    await request({
      queueName,
      routingKey,
      message,
      method: 'POST',
      url: `${url}/api/v1/Company`,
      headers: getHeaders(),
      body: JSON.stringify({
        socialSecurityNumber: message.issuerSSN,
        companyName: message.data.companyDisplayName,
        name: message.data.name,
        email: message.data.email,
      }),
    })
  } else if (routingKey === 'gjafakort:rejected') {
    await request({
      queueName,
      routingKey,
      message,
      method: 'DELETE',
      url: `${url}/api/v1/Company/${message.issuerSSN}`,
      headers: getHeaders(),
    })
  } else {
    throw new RoutingKeyError(queueName, routingKey)
  }
}
