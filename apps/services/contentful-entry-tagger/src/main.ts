import '@island.is/infra-tracing'

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false })
  const port = process.env.PORT || 3333

  app.use(
    express.json({
      type: [
        'application/json',
        'application/vnd.contentful.management.v1+json',
      ],
    }),
  )

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port)
  })
}

bootstrap()
