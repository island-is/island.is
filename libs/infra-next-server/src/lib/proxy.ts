import { Express } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
export const setupProxy = async (
  app: Express,
  proxyConfig: { [context: string]: any } | undefined,
  enabled: boolean,
) => {
  if (!proxyConfig || !enabled) {
    return
  }
  Object.keys(proxyConfig).forEach((context) => {
    app.use(
      createProxyMiddleware({ pathFilter: context, ...proxyConfig[context] }),
    )
  })
}
