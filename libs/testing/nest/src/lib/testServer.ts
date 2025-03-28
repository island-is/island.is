import { ValidationPipe, INestApplication, Type } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'

// Intentional circular dependency as infra-nest-server has tests which use this function.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { InfraModule, HealthCheckOptions } from '@island.is/infra-nest-server'

import cookieParser from 'cookie-parser'

type CleanUp = () => Promise<void> | undefined

export type TestApp = INestApplication & { cleanUp: CleanUp }

export type TestServerOptions = {
  appModule: Type<any>
  override?: (builder: TestingModuleBuilder) => TestingModuleBuilder
  hooks?: {
    override?: (builder: TestingModuleBuilder) => TestingModuleBuilder
    extend?: (app: TestApp) => Promise<CleanUp | undefined>
  }[]

  /**
   * Enables NestJS versioning.
   */
  enableVersioning?: boolean

  /**
   * Configure health checks for the test server setup
   */
  healthCheck?: boolean | HealthCheckOptions

  /**
   * Hook to run before server is started.
   * @param app The nest application instance.
   * @returns a promise that resolves when the hook is done.
   */
  beforeServerStart?: (app: TestApp) => Promise<void> | undefined
}

export const testServer = async ({
  appModule,
  hooks = [],
  override,
  enableVersioning,
  healthCheck,
  beforeServerStart,
}: TestServerOptions): Promise<TestApp> => {
  let builder = Test.createTestingModule({
    imports: [InfraModule.forRoot({ appModule, healthCheck })],
  })

  if (override) {
    builder = override(builder)
  }

  hooks.forEach((hook) => {
    if (hook.override) {
      builder = hook.override(builder)
    }
  })

  const moduleRef = await builder.compile()
  const app = moduleRef.createNestApplication().useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
    }),
  ) as TestApp

  if (enableVersioning) {
    app.enableVersioning()
  }

  if (beforeServerStart) {
    await beforeServerStart(app)
  }

  app.use(cookieParser())

  await app.init()

  const hookCleanups = await Promise.all(
    hooks.map((hook) => hook.extend && hook.extend(app)),
  )

  app.cleanUp = async () => {
    await app.close()
    await Promise.all(hookCleanups.map((cleanup) => cleanup?.()))
  }

  return app
}
