import { Express } from 'express'
import type { Options } from 'http-proxy-middleware'
import { logger } from '@island.is/logging'

export const setupProxy = async (
  app: Express,
  proxyConfig: { [context: string]: Options } | undefined,
  dev: boolean,
) => {
  if (!proxyConfig || !dev) {
    return
  }
  const { createProxyMiddleware } = await import('http-proxy-middleware')
  Object.keys(proxyConfig).forEach((context) => {
    app.use(createProxyMiddleware(context, proxyConfig[context]))
  })
}
