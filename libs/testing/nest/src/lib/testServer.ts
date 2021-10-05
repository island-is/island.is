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

export type TestServerOptions<AppModule> = {
  appModule: AppModule
  override?: (builder: TestingModuleBuilder) => TestingModuleBuilder
  currentUser?: User
  hooks?: ((app: INestApplication) => Promise<INestApplication>)[]
}

export const testServer = async <AppModule>({
  appModule,
  currentUser,
  hooks = [],
  override,
}: TestServerOptions<AppModule>): Promise<INestApplication> => {
  let builder = Test.createTestingModule({
    imports: [InfraModule.forRoot(appModule as any)],
  })

  if (currentUser) {
    builder = builder
      .overrideGuard(IdsAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(IdsUserGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = getRequest(context)
          request.user = currentUser
          return true
        },
      })
      .overrideGuard(ScopesGuard)
      .useValue({ canActivate: () => true })
  }

  if (override) {
    builder = override(builder)
  }

  const moduleRef = await builder.compile()
  let app: INestApplication = await moduleRef
    .createNestApplication()
    .useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    )
    .init()

  hooks.forEach(async (hook) => {
    app = await hook(app)
  })

  return app
}
