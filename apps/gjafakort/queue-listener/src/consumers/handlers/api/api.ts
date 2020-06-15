import fetch from 'isomorphic-unfetch'
import timeoutSignal from 'timeout-signal'

import { ProcessingError } from '../errors'
import { environment } from '../../../environments'

const SEVEN_SECONDS_TIMEOUT = 7 * 1000
const { applicationUrl } = environment

interface ApiParams {
  method: string
  url: string
  query?: object
  body?: string
  headers?: object

  applicationId: string
}

const postApplicationAuditLog = async (
  applicationId: string,
  success: boolean,
  description: string,
) => {
  await fetch(`${applicationUrl}/applications/${applicationId}/auditLog`, {
    method: 'POST',
    signal: timeoutSignal(SEVEN_SECONDS_TIMEOUT),
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
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
  query = {},
  body = '',
  headers = {},
  applicationId,
}: ApiParams) => {
  let data
  try {
    const urlParams = new URLSearchParams()
    Object.keys(query).forEach((queryKey) =>
      urlParams.append(queryKey, query[queryKey]),
    )
    let fullUrl = url
    if (urlParams.toString()) {
      fullUrl = `${fullUrl}?${urlParams.toString()}`
    }

    const res = await fetch(fullUrl, {
      method,
      body,
      signal: timeoutSignal(SEVEN_SECONDS_TIMEOUT),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    data = await res.text()
    if (!res.ok) {
      throw new ProcessingError(url, res.status, data)
    }

    postApplicationAuditLog(
      applicationId,
      true,
      `Success making request for message with url '${url}'`,
    )
  } catch (err) {
    postApplicationAuditLog(
      applicationId,
      false,
      `Error making the request with url '${url}': ${err}`,
    )
    throw err
  }
  if (!data) {
    return {}
  }
  return JSON.parse(data)
}
