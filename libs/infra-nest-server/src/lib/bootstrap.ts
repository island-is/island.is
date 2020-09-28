import { initTracing } from '@island.is/infra-tracing'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import {
  INestApplication,
  Type,
  ValidationPipe,
  NestInterceptor,
} from '@nestjs/common'
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { runMetricServer } from './runMetricServer'
import { logger, LoggingModule } from '@island.is/logging'
import { collectDefaultMetrics } from 'prom-client'
import { httpRequestDurationMiddleware } from './httpRequestDurationMiddleware'
import { InfraModule } from './infra/infra.module'
import yaml from 'js-yaml'
import * as yargs from 'yargs'
import * as fs from 'fs'

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
   * The base path of the swagger documentation.
   */
  swaggerPath?: string

  /**
   * OpenAPI definition.
   */
  openApi?: Omit<OpenAPIObject, 'paths'>

  /**
   * The port to start the server on.
   */
  port?: number

  /**
   * Hook up global interceptors to app
   */
  interceptors?: NestInterceptor[]
}

const createApp = async (options: RunServerOptions) => {
  const app = await NestFactory.create(InfraModule.forRoot(options.appModule), {
    logger: LoggingModule.createLogger(),
  })
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  )
  app.use(httpRequestDurationMiddleware())
  app.use(cookieParser())

  return app
}

const startServer = async (app: INestApplication, port = 3333) => {
  const servicePort = parseInt(process.env.PORT || '') || port
  const metricsPort = servicePort + 1
  await app.listen(servicePort, () => {
    logger.info(`Service listening at http://localhost:${servicePort}`, {
      context: 'Bootstrap',
    })
  })
  await runMetricServer(metricsPort)
}

function setupOpenApi(
  app: INestApplication,
  openApi: Omit<OpenAPIObject, 'paths'>,
  swaggerPath?: string,
) {
  const document = SwaggerModule.createDocument(app, openApi)
  SwaggerModule.setup(swaggerPath ?? 'swagger', app, document)
  return document
}

function generateSchema(filePath: string, document: OpenAPIObject) {
  logger.info('Generating OpenAPI schema.', { context: 'Bootstrap' })
  fs.writeFileSync(filePath, yaml.safeDump(document, { noRefs: true }))
}

export const bootstrap = async (options: RunServerOptions) => {
  const argv = yargs.option('generateSchema', {
    description: 'Generate OpenAPI schema into the specified file',
    type: 'string',
  }).argv

  initTracing(options.name)
  collectDefaultMetrics()

  const app = await createApp(options)
  if (options.openApi) {
    const document = setupOpenApi(app, options.openApi, options.swaggerPath)

    if (argv.generateSchema) {
      generateSchema(argv.generateSchema, document)
      return
    }
  }
  if (options.interceptors) {
    options.interceptors.forEach((interceptor) => {
      app.useGlobalInterceptors(interceptor)
    })
  }

  startServer(app, options.port)
}
