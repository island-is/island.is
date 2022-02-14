import { Request, Response, NextFunction } from 'express'

/**
 * SwaggerModule in NestJS uses swagger-ui-express which utilises the express.static
 * method to serve the static files for the SwaggerUI. The express.static redirects to
 * trailing '/' if pathname is directory. This causes trouble for our APIs which are using
 * Ingress rewrite-target to add a prefix in dev|staging|prod. So we use this middleware
 * to overwrite the redirect to include the prefix if it is set.
 *
 * This middleware should be mounted on the `swaggerPath` path.
 * @param swaggerPath Path where the SwaggerUI is mounted
 */
export const swaggerRedirectMiddleware = (swaggerPath: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.endsWith(swaggerPath) && process.env.PUBLIC_URL) {
      const targetUrl = new URL(`${process.env.PUBLIC_URL}${swaggerPath}/`)
      return res.redirect(targetUrl.pathname)
    }
    next()
  }
}
