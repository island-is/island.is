import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'

import {
  IdsAuthGuard,
  IdsUserGuard,
  Auth,
  MockAuthGuard,
} from '@island.is/auth-nest-tools'

interface UseAuth {
  auth: Auth
}

export default ({ auth }: UseAuth) => ({
  override: (builder: TestingModuleBuilder) =>
    builder
      .overrideGuard(IdsAuthGuard)
      .useValue(new MockAuthGuard(auth))
      .overrideGuard(IdsUserGuard)
      .useValue(new MockAuthGuard(auth)),
})
