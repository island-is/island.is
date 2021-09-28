import { Type, ValidationPipe, ExecutionContext } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'

import {
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
  getRequest,
  User,
} from '@island.is/auth-nest-tools'
import { InfraModule } from './infra/infra.module'

export type TestServerOptions = {
  /**
   * Main nest module.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appModule: Type<any>

  /**
   * Hook to override providers.
   */
  override?: (builder: TestingModuleBuilder) => TestingModuleBuilder
}

export const testServer = async (options: TestServerOptions) => {
  let builder = Test.createTestingModule({
    imports: [InfraModule.forRoot(options.appModule)],
  })
  if (options.override) {
    builder = options.override(builder)
  }

  const moduleRef = await builder.compile()
  const app = moduleRef.createNestApplication()
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  )

  return app.init()
}

// Sets up a test environment that ignores various Guards on controllers
export const testServerActivateAuthGuards = async (
  options: TestServerOptions,
) => {
  const user = {
    nationalId: '0101303019', // Gervimadur Afrika
    scope: [],
    authorization: '',
    client: '',
  }

  const builder = Test.createTestingModule({
    imports: [InfraModule.forRoot(options.appModule)],
  })
    .overrideGuard(IdsAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(IdsUserGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        const request = getRequest(context)
        request.user = user
        return true
      },
      user,
    })
    .overrideGuard(ScopesGuard)
    .useValue({ canActivate: () => true })
    .overrideProvider(CurrentUser)
    .useValue(user)

  if (options.override) {
    options.override(builder)
  }

  const moduleFixture = await builder.compile()
  const app = moduleFixture.createNestApplication()
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  )

  return app.init()
}
