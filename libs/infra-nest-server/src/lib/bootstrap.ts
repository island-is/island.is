import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import type { Server } from 'http'

import {
  logger,
  LoggingModule,
  monkeyPatchServerLogging,
} from '@island.is/logging'
import { getServerPort, startMetricServer } from '@island.is/infra-metrics'
import '@island.is/infra-tracing'

import { httpRequestDurationMiddleware } from './httpRequestDurationMiddleware'
import { InfraModule } from './infra/infra.module'
import { swaggerRedirectMiddleware } from './swaggerMiddlewares'
import { InfraNestServer, RunServerOptions } from './types'

// Allow client connections to stay connected for up to 30 seconds of inactivity. For reference, the default value in
// Node.JS is 5 seconds, Kestrel (.NET) is 120 seconds and Nginx is 75 seconds.
const KEEP_ALIVE_TIMEOUT = 1000 * 30

export const createApp = async ({
  stripNonClassValidatorInputs = true,
  appModule,
  enableVersioning,
  healthCheck,
  beforeAppInit,
  ...options
}: RunServerOptions) => {
  if (beforeAppInit) {
    await beforeAppInit()
  }
  monkeyPatchServerLogging()

  const app = await NestFactory.create<NestExpressApplication>(
    InfraModule.forRoot({
      appModule,
      healthCheck,
    }),
    {
      logger: LoggingModule.createLogger(),
    },
  )

  if (enableVersioning) {
    app.enableVersioning()
  }

  if (options.enableCors) {
    const { path, ...corsOptions } = options.enableCors
    if (path) {
      app.use(path, cors(corsOptions))
    } else {
      app.enableCors(corsOptions)
    }
  }

  // Configure "X-Requested-For" handling.
  // Internal services should trust the X-Forwarded-For header (EXPRESS_TRUST_PROXY=1)
  // Public services (eg API Gateway) should trust our own reverse proxies
  // (eg Elastic Load Balancer, Kubernetes Ingress, CloudFront CDN) and trim
  // the X-Forwarded-For header before passing to internal services.
  app.set('trust proxy', JSON.parse(process.env.EXPRESS_TRUST_PROXY || 'false'))

  // The 'extended' query parser exists for backward compatibility with
  // external REST clients: e.g. axios's default serializer emits bracket
  // arrays (?ids[]=1&ids[]=2), which the 'simple' parser would leave as a
  // literal "ids[]" key. Internal code doesn't rely on it.
  app.set('query parser', 'extended')

  // Enable validation of request DTOs globally.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: stripNonClassValidatorInputs,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
    }),
  )

  const globalPrefix = options.globalPrefix

  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix)
  }

  if (options.collectMetrics !== false) {
    app.use(httpRequestDurationMiddleware())
  }
  app.use(cookieParser())

  if (options.jsonBodyLimit) {
    app.use(bodyParser.json({ limit: options.jsonBodyLimit }))
  }

  // Handlers and ValidationPipe assume req.body is always an object;
  // default it for bodyless requests.
  app.use((req: { body?: unknown }, _res: unknown, next: () => void) => {
    req.body = req.body ?? {}
    next()
  })

  return app
}

const startServer = async (
  app: INestApplication,
  port: number,
): Promise<Server> => {
  const server: Server = await app.listen(port)
  logger.info(
    `Service listening at http://localhost:${getServerPort(server, port)}`,
    {
      context: 'Bootstrap',
    },
  )

  // Allow connections to remain idle for a bit longer than the default 5s.
  server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT
  return server
}

function setupOpenApi(
  app: INestApplication,
  openApi: Omit<OpenAPIObject, 'paths'>,
  swaggerPath = '/swagger',
) {
  app.use(swaggerPath, swaggerRedirectMiddleware(swaggerPath))

  const document = SwaggerModule.createDocument(app, openApi, {
    // Keep pre-@nestjs/swagger-11 operationId naming (no version suffix) so
    // the runtime swagger doc matches the generated clients. See buildOpenApi.
    operationIdFactory: (controllerKey, methodKey) =>
      `${controllerKey}_${methodKey}`,
  })
  SwaggerModule.setup(swaggerPath, app, document)

  return document
}

export const bootstrap = async (
  options: RunServerOptions,
): Promise<InfraNestServer> => {
  const app = await createApp(options)

  if (options.openApi) {
    const document = setupOpenApi(app, options.openApi, options.swaggerPath)
  }

  if (options.interceptors) {
    options.interceptors.forEach((interceptor) => {
      app.useGlobalInterceptors(interceptor)
    })
  }

  if (options.beforeServerStart) {
    options.beforeServerStart(app)
  }

  const serverPort = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : options.port ?? 3333
  const metricServerPort = serverPort === 0 ? 0 : serverPort + 1
  const server = await startServer(app, serverPort)
  const metricsServer =
    options.collectMetrics !== false
      ? await startMetricServer(metricServerPort)
      : undefined

  return {
    app,
    server,
    metricsServer,
    close: async () => {
      await app.close()
      if (metricsServer) {
        return new Promise((resolve) => metricsServer.close(() => resolve()))
      }
    },
  }
}
