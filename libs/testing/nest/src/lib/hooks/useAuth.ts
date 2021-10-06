import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'
import { ExecutionContext, INestApplication } from '@nestjs/common'

import {
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
  getRequest,
  User,
} from '@island.is/auth-nest-tools'

interface UseAuth {
  currentUser: User
}

export default ({ currentUser }: UseAuth) => ({
  override: (builder: TestingModuleBuilder) =>
    builder
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
      .useValue({ canActivate: () => true }),
})
