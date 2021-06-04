import { DynamicModule, Module } from '@nestjs/common'

import {
  AuthPublicApiClientModule,
  AuthPublicApiClientModuleConfig,
} from '@island.is/clients/auth-public-api'

import {
  AuthScopeResolver,
  DelegationScopeResolver,
  MainResolver,
} from './resolvers'
import { AuthService } from './auth.service'

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
