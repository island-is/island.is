import { Express } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
export const setupProxy = async (
  app: Express,
  proxyConfig: { [context: string]: any } | undefined,
  dev: boolean,
) => {
  if (!proxyConfig || !dev) {
    return
  }
  Object.keys(proxyConfig).forEach((context) => {
    app.use(createProxyMiddleware(context, proxyConfig[context]))
  })
}
