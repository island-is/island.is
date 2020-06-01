import fetch from 'isomorphic-unfetch'
import timeoutSignal from 'timeout-signal'
import { ProcessingError } from './errors'

const SEVEN_SECONDS_TIMEOUT = 7 * 1000

interface ApiParams {
  method: string
  url: string
  body?: string
  headers?: any

  queueName: string
}

export const request = async ({
  method,
  url,
  body,
  headers,
  queueName,
}: ApiParams) => {
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
    throw new ProcessingError(queueName, url, res.status, data)
  }
  return res
}
