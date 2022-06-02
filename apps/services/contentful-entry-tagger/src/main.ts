import { HttpException, HttpStatus, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import express, { NextFunction } from 'express'
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

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false })
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  const port = process.env.PORT || 3333

  app.use(
    express.json({
      type: [
        'application/json',
        'application/vnd.contentful.management.v1+json',
      ],
    }),
  )

  // Make sure requests are signed
  app.use((req: Request, _res: Response, next: NextFunction) => {
    try {
      const requestIsSigned = verifyRequest(
        REQUEST_TOKEN,
        ({
          path: ENTRY_CREATED_PATH,
          headers: req.headers,
          method: req.method,
          body: JSON.stringify(req.body),
        } as unknown) as VerifiableRequest,
        0,
      )
      if (!requestIsSigned) {
        logger.info(
          `Request was received from an unauthorized source and will be ignored`,
        )
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
      }
      next()
    } catch (error) {
      logger.info(
        `Request signature could not be parsed, request will be ignored`,
      )
      throw new HttpException(
        'Unauthorized, signature could not be parsed',
        HttpStatus.UNAUTHORIZED,
      )
    }
  })

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix)
  })
}

bootstrap()
