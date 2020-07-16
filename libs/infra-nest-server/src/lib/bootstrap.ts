import { NestFactory } from '@nestjs/core'
import { INestApplication, Type, ValidationPipe } from '@nestjs/common'
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { runMetricServer } from './runMetricServer'
import { logger, LoggingModule } from '@island.is/logging'
import { initTracing } from '@island.is/infra-tracing'
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
   * OpenAPI definition.
   */
  openApi: Omit<OpenAPIObject, 'paths'>
}

const createApp = async (options: RunServerOptions) => {
  const app = await NestFactory.create(InfraModule.forRoot(options.appModule), {
    logger: LoggingModule.createLogger(),
  })
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  )
  app.use(httpRequestDurationMiddleware())

  return app
}

const startServer = async (app: INestApplication) => {
  const servicePort = parseInt(process.env.port || '3333')
  const metricsPort = servicePort + 1
  await app.listen(servicePort, () => {
    logger.info(`Service listening at http://localhost:${servicePort}`, {
      context: 'Bootstrap',
    })
  })
  await runMetricServer(metricsPort)
}

function setupOpenApi(app: INestApplication, options: RunServerOptions) {
  const document = SwaggerModule.createDocument(app, options.openApi)
  SwaggerModule.setup('swagger', app, document)
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

  startServer(app)
}
