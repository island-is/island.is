import { HttpException, HttpStatus } from '@nestjs/common'
import { NextFunction } from 'express'
import { verifyRequest } from '@contentful/node-apps-toolkit'
import { logger } from '@island.is/logging'

interface VerifiableRequest {
  method: 'GET' | 'PATCH' | 'HEAD' | 'POST' | 'DELETE' | 'OPTIONS' | 'PUT'
  path: string
  headers?: { [_: string]: string } | undefined
  body?: string | undefined
}

const REQUEST_TOKEN = process.env.CONTENTFUL_REQUEST_TOKEN as string
const ENTRY_CREATED_PATH = '/api/entry-created'

export class AppMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    try {
      const requestIsSigned = verifyRequest(REQUEST_TOKEN, {
        path: ENTRY_CREATED_PATH,
        headers: req.headers,
        method: req.method,
        body: JSON.stringify(req.body),
      } as unknown as VerifiableRequest)
      if (!requestIsSigned) {
        logger.info(
          `Request was received from an unauthorized source and will be ignored`,
        )
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
      }
      next()
    } catch (error) {
      logger.error(
        `Request signature could not be parsed, request will be ignored`,
        error,
      )
      throw new HttpException(
        'Unauthorized, signature could not be parsed',
        HttpStatus.UNAUTHORIZED,
      )
    }
  }
}
