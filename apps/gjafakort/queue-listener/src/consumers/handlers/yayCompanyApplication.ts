import md5 from 'crypto-js/md5'

import {
  GjafakortApplicationMessage,
  GjafakortApplicationRoutingKey,
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
  'gjafakort-company-application-updates'

export const routingKeys: GjafakortApplicationRoutingKey[] = [
  'approved',
  'pending',
  'rejected',
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
  message: GjafakortApplicationMessage,
  routingKey: GjafakortApplicationRoutingKey,
) => {
  logger.debug(
    `receiving message ${message.id} on ${queueName} with routingKey ${routingKey}`,
    message,
  )

  if (routingKey === 'approved' || routingKey === 'pending') {
    await request({
      queueName,
      applicationId: message.id,
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
  } else if (routingKey === 'rejected') {
    await request({
      queueName,
      applicationId: message.id,
      method: 'DELETE',
      url: `${url}/api/v1/Company/${message.issuerSSN}`,
      headers: getHeaders(),
    })
  } else {
    throw new RoutingKeyError(queueName, routingKey)
  }
}
