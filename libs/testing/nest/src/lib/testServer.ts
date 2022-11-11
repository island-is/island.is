import { ValidationPipe, INestApplication, Type } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'

import { InfraModule } from '@island.is/infra-nest-server'

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
}

export const testServer = async ({
  appModule,
  hooks = [],
  override,
  enableVersioning,
}: TestServerOptions): Promise<TestApp> => {
  let builder = Test.createTestingModule({
    imports: [InfraModule.forRoot({ appModule })],
  })

  if (override) {
    builder = override(builder)
  }

  hooks.forEach(async (hook) => {
    if (hook.override) {
      builder = await hook.override(builder)
    }
  })

  const moduleRef = await builder.compile()
  const app = (await moduleRef
    .createNestApplication()
    .useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    )) as TestApp

  if (enableVersioning) {
    app.enableVersioning()
  }

  await app.init()

  const hookCleanups = await Promise.all(
    hooks.map((hook) => {
      if (hook.extend) {
        return hook.extend(app)
      }
    }),
  )

  app.cleanUp = async () => {
    await app.close()
    await Promise.all(hookCleanups.map((cleanup) => cleanup && cleanup()))
  }

  return app
}
