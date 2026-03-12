import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

const graphqlPath = '/api/graphql'
const { serverRuntimeConfig = {} } = getConfig() ?? {}
const defaultGraphqlEndpoint = `${
  process.env.API_URL ?? 'http://localhost:4444'
}${graphqlPath}`
const graphqlEndpoint =
  serverRuntimeConfig.graphqlEndpoint ?? defaultGraphqlEndpoint

const shouldForwardBody = (method?: string) =>
  method !== 'GET' && method !== 'HEAD'

const getForwardBody = (req: NextApiRequest): string | undefined => {
  if (!shouldForwardBody(req.method) || req.body == null) return undefined
  if (typeof req.body === 'string') return req.body
  return JSON.stringify(req.body)
}

const createForwardHeaders = (req: NextApiRequest) => {
  const headers = new Headers()

  for (const [key, value] of Object.entries(req.headers)) {
    if (!value || key === 'host' || key === 'content-length') continue
    headers.set(key, Array.isArray(value) ? value.join(', ') : value)
  }

  return headers
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const queryString = req.url?.split('?')[1]
  const targetUrl = `${graphqlEndpoint}${queryString ? `?${queryString}` : ''}`

  const upstreamResponse = await fetch(targetUrl, {
    method: req.method,
    headers: createForwardHeaders(req),
    body: getForwardBody(req),
  })

  res.status(upstreamResponse.status)

  upstreamResponse.headers.forEach((value, key) => {
    if (key === 'transfer-encoding' || key === 'connection') return
    res.setHeader(key, value)
  })

  const responseBuffer = Buffer.from(await upstreamResponse.arrayBuffer())
  res.send(responseBuffer)
}

export default handler
