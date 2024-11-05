import bodyParser from 'body-parser'

/**
 * Middleware that includes the raw body in the request object.
 */
export const includeRawBodyMiddleware = () => {
  return bodyParser.json({
    verify: (req: any, res, buf) => {
      if (buf && buf.length) {
        req.rawBody = buf
      }
    },
  })
}
