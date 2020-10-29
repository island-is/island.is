import { Type, ValidationPipe } from '@nestjs/common'
import { InfraModule } from './infra/infra.module'
import { Test } from '@nestjs/testing'
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'
import { ScopesGuard, IdsAuthGuard } from '@island.is/auth-api-lib'

export type TestServerOptions = {
  /**
   * Main nest module.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appModule: Type<any>

  /**
   * Hook to override providers.
   */
  override?: (builder: TestingModuleBuilder) => void
}

export const testServer = async (options: TestServerOptions) => {
  const builder = Test.createTestingModule({
    imports: [InfraModule.forRoot(options.appModule)],
  })
  if (options.override) {
    options.override(builder)
  }

  const moduleRef = await builder.compile()
  const app = moduleRef.createNestApplication()
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  )

  return app.init()
}

// Sets up a test environment that ignores various Guards on controllers
export const testServerActivateAuthGuards = async (options: TestServerOptions) => {
  const moduleFixture = await Test.createTestingModule({
    imports: [InfraModule.forRoot(options.appModule)],
  })
    .overrideGuard(IdsAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(ScopesGuard)
    .useValue({ canActivate: () => true })
    .compile()

  const app = moduleFixture.createNestApplication()
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  )

  return app.init()
}
