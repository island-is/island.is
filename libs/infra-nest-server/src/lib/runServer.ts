import { NestFactory } from '@nestjs/core'
import { Type, ValidationPipe } from '@nestjs/common'
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { runMetricServer } from './runMetricServer';
import { logger, LoggingModule } from '@island.is/logging'
import { initTracing } from '@island.is/infra-tracing'
import { collectDefaultMetrics } from 'prom-client'
import { httpRequestDurationMiddleware } from './httpRequestDurationMiddleware'
import { InfraModule } from './infra/infra.module'

type RunServerOptions = {
  /**
   * Main nest module.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appModule: Type<any>

  /**
   * Server name.
   */
  name: string

  /**
   * OpenAPI definition.
   */
  openApi: Omit<OpenAPIObject, 'paths'>
}

export const runServer = async (options: RunServerOptions) => {
  initTracing(options.name)
  collectDefaultMetrics()

  const app = await NestFactory.create(InfraModule.forRoot(options.appModule), {
    logger: LoggingModule.createLogger(),
  })
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  )

  app.use(httpRequestDurationMiddleware())

  const servicePort = parseInt(process.env.port || '3333')
  const metricsPort = servicePort + 1

  // Set up swagger document and endpoint.
  const document = SwaggerModule.createDocument(app, options.openApi)
  SwaggerModule.setup('swagger', app, document)

  // Error logging?

  const server = await app.listen(servicePort, () => {
    logger.info(`Service listening at http://localhost:${servicePort}`)
  })
  server.on('error', logger.error)
  await runMetricServer(metricsPort)
}
