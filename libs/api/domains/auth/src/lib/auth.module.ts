import { DynamicModule, Module } from '@nestjs/common'

import {
  AuthPublicApiClientModule,
  AuthPublicApiClientModuleConfig,
} from '@island.is/clients/auth-public-api'

import { AuthScopeResolver } from './authScope.resolver'
import { AuthService } from './auth.service'
import { DelegationScopeResolver } from './delegationScope.resolver'
import { MainResolver } from './main.resolver'

export type Config = AuthPublicApiClientModuleConfig

@Module({
  providers: [
    MainResolver,
    DelegationScopeResolver,
    AuthScopeResolver,
    AuthService,
  ],
})
export class AuthModule {
  static register(config: Config): DynamicModule {
    return {
      module: AuthModule,
      imports: [AuthPublicApiClientModule.register(config)],
    }
  }
}
