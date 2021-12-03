import { DynamicModule, Module } from '@nestjs/common'

import {
  AuthPublicApiClientModule,
  AuthPublicApiClientModuleConfig,
} from '@island.is/clients/auth-public-api'
import { IdentityModule } from '@island.is/api/domains/identity'

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
  static register(config: Config): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        AuthPublicApiClientModule.register(config.authPublicApi),
        IdentityModule,
      ],
    }
  }
}
