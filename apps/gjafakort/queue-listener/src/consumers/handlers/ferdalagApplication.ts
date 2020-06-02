import {
  ApplicationMessage,
  ApplicationRoutingKey,
} from '@island.is/message-queue'
import { logger } from '@island.is/logging'

import { environment } from '../../environments'
import { RoutingKeyError } from './errors'
import { request } from './api'

const {
  ferdalag: { url, apiKey },
} = environment

export const routingKeys: ApplicationRoutingKey[] = [
  'approved',
  'manual-approved',
]

export const queueName = 'gjafakort-ferdalag-application'

export const handler = async (
  message: ApplicationMessage,
  routingKey: ApplicationRoutingKey,
) => {
  logger.debug(
    `receiving message ${message.id} on ${queueName} with routingKey ${routingKey}`,
    message,
  )

  const body = {
    giftcert: true,
    contactEmail: message.data.email,
    contactName: message.data.name,
    email: message.data.generalEmail,
    phone: message.data.phoneNumber,
    website: message.data.webpage,
    isat: '???', // TODO this should be removed??
    name: message.data.companyDisplayName,
    legalName: message.data.companyName,
  }

  if (routingKey === 'approved') {
    await request({
      queueName,
      applicationId: message.id,
      method: 'POST',
      url: `${url}/ssn/update/${message.issuerSSN}?key=${apiKey}`,
      body: JSON.stringify(body),
    })
  } else if (routingKey === 'manual-approved') {
    await request({
      queueName,
      applicationId: message.id,
      method: 'POST',
      url: `${url}/ssn/create/?key=${apiKey}`,
      body: JSON.stringify({
        SSN: message.issuerSSN,
        ...body,
      }),
    })
  } else {
    throw new RoutingKeyError(queueName, routingKey)
  }
}
