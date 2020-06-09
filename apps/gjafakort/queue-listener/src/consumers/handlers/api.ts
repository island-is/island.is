import fetch from 'isomorphic-unfetch'
import timeoutSignal from 'timeout-signal'

import { logger } from '@island.is/logging'
import {
  GjafakortApplicationMessage,
  GjafakortApplicationRoutingKey,
} from '@island.is/message-queue'

import { ProcessingError } from './errors'
import { environment } from '../../environments'

const SEVEN_SECONDS_TIMEOUT = 7 * 1000
const { applicationUrl } = environment

interface ApiParams {
  method: string
  url: string
  body?: string
  headers?: any

  queueName: string
  routingKey: GjafakortApplicationRoutingKey
  message: GjafakortApplicationMessage
}

const postApplicationAuditLog = async (
  message: GjafakortApplicationMessage,
  success: boolean,
  description: string,
) => {
  await fetch(`${applicationUrl}/applications/${message.id}/auditLog`, {
    method: 'POST',
    signal: timeoutSignal(SEVEN_SECONDS_TIMEOUT),
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      state: message.state,
      authorSSN: message.authorSSN,
      title: 'Status from message queue',
      data: {
        success,
        description,
      },
    }),
  })
}

export const request = async ({
  method,
  url,
  body,
  headers,
  queueName,
  routingKey,
  message,
}: ApiParams) => {
  try {
    const res = await fetch(url, {
      method,
      body,
      signal: timeoutSignal(SEVEN_SECONDS_TIMEOUT),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    const data = await res.text()
    if (!res.ok) {
      throw new ProcessingError(queueName, routingKey, res.status, data)
    }

    postApplicationAuditLog(
      message,
      true,
      `Success making request for message on '${queueName}' with routing key '${routingKey}'`,
    )
    logger.info(
      `Processed message ${message.id} on ${queueName} with status ${res.status}`,
    )
  } catch (err) {
    postApplicationAuditLog(message, false, `Error making the request: ${err}`)
    throw err
  }
}
