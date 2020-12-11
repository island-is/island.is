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

type OpenApi = {
  /**
   * Path for the OpenAPI output yml
   */
  path: string

  /**
   * OpenAPI definition.
   */
  document: Omit<OpenAPIObject, 'paths'>

  /**
   * The base path of the swagger documentation.
   */
  swaggerPath?: string
}

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
   * OpenAPI
   */
  openApi?: OpenApi

  /**
   * The port to start the server on.
   */
  port?: number

  /**
   * Hook up global interceptors to app
   */
  interceptors?: NestInterceptor[]
}

export const createApp = async (options: RunServerOptions) => {
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

export function setupOpenApi(app: INestApplication, openApi: OpenApi) {
  const document = SwaggerModule.createDocument(app, openApi.document)
  SwaggerModule.setup(openApi.swaggerPath ?? 'swagger', app, document)
  return document
}

export function generateSchema(filePath: string, document: OpenAPIObject) {
  logger.info('Generating OpenAPI schema.', { context: 'Bootstrap' })
  fs.writeFileSync(filePath, yaml.safeDump(document, { noRefs: true }))
}

export const bootstrap = async (options: RunServerOptions) => {
  // TODO move to rewire, external config or something else
  // We don't want to run this function if we are just generating schemas files.
  if (process.env.INIT_SCHEMA === 'true') {
    return
  }

  const argv = yargs.option('generateSchema', {
    description: 'Generate OpenAPI schema into the specified file',
    type: 'string',
  }).argv

  initTracing(options.name)
  collectDefaultMetrics()

  const app = await createApp(options)

  if (options.openApi) {
    const document = setupOpenApi(app, options.openApi)

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
