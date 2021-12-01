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
import { MeDelegationsService } from './meDelegations.service'
import { ActorDelegationsService } from './actorDelegations.service'
import { ApiScopeService } from './apiScope.service'

export type Config = {
  authPublicApi: AuthPublicApiClientModuleConfig
}

@Module({
  providers: [
    DelegationResolver,
    DelegationScopeResolver,
    ApiScopeResolver,
    MeDelegationsService,
    ActorDelegationsService,
    ApiScopeService,
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
