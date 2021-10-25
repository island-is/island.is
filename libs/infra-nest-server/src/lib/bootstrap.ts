import '@island.is/infra-tracing'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import {
  INestApplication,
  Type,
  ValidationPipe,
  NestInterceptor,
} from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import {
  logger,
  LoggingModule,
  monkeyPatchServerLogging,
} from '@island.is/logging'
import { startMetricServer } from '@island.is/infra-metrics'
import { httpRequestDurationMiddleware } from './httpRequestDurationMiddleware'
import { InfraModule } from './infra/infra.module'
import yaml from 'js-yaml'
import * as yargs from 'yargs'
import * as fs from 'fs'
import { NestExpressApplication } from '@nestjs/platform-express'

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

  /**
   * Global url prefix for the app
   */
  globalPrefix?: string

  stripNonClassValidatorInputs?: boolean
}

export const createApp = async ({
  stripNonClassValidatorInputs = true,
  appModule,
  ...options
}: RunServerOptions) => {
  monkeyPatchServerLogging()

  const app = await NestFactory.create<NestExpressApplication>(
    InfraModule.forRoot({
      appModule,
    }),
    {
      logger: LoggingModule.createLogger(),
    },
  )

  // Configure "X-Requested-For" handling.
  // Internal services should trust the X-Forwarded-For header (EXPRESS_TRUST_PROXY=1)
  // Public services (eg API Gateway) should trust our own reverse proxies
  // (eg Elastic Load Balancer, Kubernetes Ingress, CloudFront CDN) and trim
  // the X-Forwarded-For header before passing to internal services.
  app.set('trust proxy', JSON.parse(process.env.EXPRESS_TRUST_PROXY || 'false'))

  // Enable validation of request DTOs globally.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: stripNonClassValidatorInputs,
      forbidNonWhitelisted: true,
    }),
  )

  if (options.globalPrefix) {
    app.setGlobalPrefix(options.globalPrefix)
  }

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
  await startMetricServer(metricsPort)
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
  fs.writeFileSync(filePath, yaml.dump(document, { noRefs: true }))
}

export const bootstrap = async (options: RunServerOptions) => {
  const argv = yargs.option('generateSchema', {
    description: 'Generate OpenAPI schema into the specified file',
    type: 'string',
  }).argv

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
