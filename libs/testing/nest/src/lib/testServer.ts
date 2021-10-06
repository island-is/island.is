import {
  Type,
  ValidationPipe,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'

import {
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
  getRequest,
  User,
} from '@island.is/auth-nest-tools'
import { InfraModule } from '@island.is/infra-nest-server'

let app: INestApplication

export type TestServerOptions<AppModule> = {
  appModule: AppModule
  override?: (builder: TestingModuleBuilder) => TestingModuleBuilder
  hooks?: {
    override?: (builder: TestingModuleBuilder) => TestingModuleBuilder
    extend?: (app: INestApplication) => Promise<INestApplication>
  }[]
}

export const testServer = async <AppModule>({
  appModule,
  hooks = [],
  override,
}: TestServerOptions<AppModule>): Promise<INestApplication> => {
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
  app = await moduleRef
    .createNestApplication()
    .useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    )
    .init()

  hooks.forEach(async (hook) => {
    if (hook.extend) {
      app = await hook.extend(app)
    }
  })

  return app
}

afterAll(async () => {
  if (app) {
    await app.close()
  }
})
