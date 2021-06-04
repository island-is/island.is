import { Express } from 'express'
import type { Config } from 'http-proxy-middleware'

export const setupProxy = async (
  app: Express,
  proxyConfig: { [context: string]: Config } | undefined,
  dev: boolean,
) => {
  if (!proxyConfig || !dev) {
    return
  }
  const { default: createProxyMiddleware } = await import(
    'http-proxy-middleware'
  )
  Object.keys(proxyConfig).forEach((context) => {
    app.use(createProxyMiddleware(context, proxyConfig[context]))
  })
}
