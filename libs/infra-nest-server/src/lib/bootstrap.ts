import { initTracing } from '@island.is/infra-tracing'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { INestApplication, Type, ValidationPipe } from '@nestjs/common'
import { OpenAPIObject, SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { runMetricServer } from './runMetricServer'
import { logger, LoggingModule } from '@island.is/logging'
import { collectDefaultMetrics } from 'prom-client'
import { httpRequestDurationMiddleware } from './httpRequestDurationMiddleware'
import { InfraModule } from './infra/infra.module'
import yaml from 'js-yaml'
import * as yargs from 'yargs'
import * as fs from 'fs'

// const AuthUrl = "https://siidentityserverweb20200805020732.azurewebsites.net/connect/authorize"
// const TokenUrl = "https://siidentityserverweb20200805020732.azurewebsites.net/connect/token"
// const AuthUrl = `${process.env.IDS_ISSUER}/connect/authorize`
// const TokenUrl = `${process.env.IDS_ISSUER}/connect/token`
const AuthUrl = `https://localhost:6001/connect/authorize`
const TokenUrl = `https://localhost:6001/connect/token`

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
  const servicePort = parseInt(process.env.PORT) || port
  const metricsPort = servicePort + 1
  await app.listen(servicePort, () => {
    logger.info(`Service listening at http://localhost:${servicePort}`, {
      context: 'Bootstrap',
    })
  })
  await runMetricServer(metricsPort)
}

function setupOpenApi(app: INestApplication, options: RunServerOptions) {
  const swaggerOptions = new DocumentBuilder()
    .setTitle(options.openApi.info.title)
    .setDescription(options.openApi.info.description)
    .setVersion(options.openApi.info.version)
    .addOAuth2({
      type: "oauth2",
      flows: {
        authorizationCode: {
          authorizationUrl: AuthUrl,
          tokenUrl: TokenUrl,
          scopes: {
            "openid profile @identityserver.api/read":
            "Sækir OpenId og Profile claim-ið"
          }
        }
      }
    })
    .addBasicAuth()
    .addApiKey()
    .addCookieAuth()
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerOptions)

  SwaggerModule.setup('', app, document)
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
    const document = setupOpenApi(app, options)

    if (argv.generateSchema) {
      generateSchema(argv.generateSchema, document)
      return
    }
  }

  startServer(app, options.port)
}
