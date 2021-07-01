import { DynamicModule, Module } from '@nestjs/common'

import { Register } from '@island.is/infra-nest-server'
import {
  AuthPublicApiClientModule,
  AuthPublicApiClientModuleConfig,
} from '@island.is/clients/auth-public-api'
import {
  IdentityModule,
  Config as IdentityConfig,
} from '@island.is/api/domains/identity'

import {
  ApiScopeResolver,
  DelegationScopeResolver,
  DelegationResolver,
} from './resolvers'
import { AuthService } from './auth.service'

export type Config = {
  authPublicApi: AuthPublicApiClientModuleConfig
}

@Module({
  providers: [
    DelegationResolver,
    DelegationScopeResolver,
    ApiScopeResolver,
    AuthService,
  ],
})
export class AuthModule {
  static register({config, modules}: Register<Config, [typeof IdentityModule]>): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        AuthPublicApiClientModule.register(config!.authPublicApi),
        ...modules!,
      ],
    }
  }
}
