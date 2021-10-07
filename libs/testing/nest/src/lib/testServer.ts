import { ValidationPipe, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'

import { InfraModule } from '@island.is/infra-nest-server'

type CleanUp = () => Promise<void> | undefined

export type TestApp = INestApplication & { cleanUp: CleanUp }

export type TestServerOptions<AppModule> = {
  appModule: AppModule
  override?: (builder: TestingModuleBuilder) => TestingModuleBuilder
  hooks?: {
    override?: (builder: TestingModuleBuilder) => TestingModuleBuilder
    extend?: (app: TestApp) => Promise<CleanUp | undefined>
  }[]
}

export const testServer = async <AppModule>({
  appModule,
  hooks = [],
  override,
}: TestServerOptions<AppModule>): Promise<TestApp> => {
  let builder = Test.createTestingModule({
    imports: [InfraModule.forRoot(appModule as any)],
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
    )
    .init()) as TestApp

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
