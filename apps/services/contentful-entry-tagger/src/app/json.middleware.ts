import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import getRawBody from 'raw-body'
import { Readable } from 'stream'

/**
 * This middleware was necessary since Contentful has a content-type header that the default NestJS body parser doesn't parse
 * The header is -> Content-Type: application/vnd.contentful.management.v1+json
 */

@Injectable()
export class JSONMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawBody = await getRawBody(req as Readable)
    req.body = JSON.parse(rawBody.toString().trim())
    next()
  }
}
