import fetch from 'isomorphic-unfetch'
import timeoutSignal from 'timeout-signal'
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
  applicationId: string
}

const updateApplication = async (
  applicationId,
  queueName,
  success,
  message,
) => {
  await fetch(`${applicationUrl}/applications/${applicationId}`, {
    method: 'PUT',
    signal: timeoutSignal(SEVEN_SECONDS_TIMEOUT),
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        status: {
          [queueName]: {
            success,
            message,
          },
        },
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
  applicationId,
}: ApiParams) => {
  let res
  try {
    res = await fetch(url, {
      method,
      body,
      signal: timeoutSignal(SEVEN_SECONDS_TIMEOUT),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  } catch (err) {
    const message = `Error making the request: ${err}`
    updateApplication(applicationId, queueName, false, message)
    throw err
  }

  const data = await res.text()
  if (res.ok) {
    const message = 'Success from third party'
    updateApplication(applicationId, queueName, true, message)
  } else {
    const message = `Error from third party: ${data}`
    updateApplication(applicationId, queueName, false, message)
    throw new ProcessingError(queueName, url, res.status, data)
  }
  return res
}
