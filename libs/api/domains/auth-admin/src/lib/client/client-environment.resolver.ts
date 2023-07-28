import { UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { Loader } from '@island.is/nest/dataloader'

import { ClientEnvironment } from './models/client-environment.model'
import { ClientSecret } from './models/client-secret.model'
import type { ClientSecretDataLoader } from './client-secret.loader'
import { ClientSecretLoader } from './client-secret.loader'
import { ClientAllowedScope } from './models/client-allowed-scope.model'
import type { ClientAllowedScopesDataLoader } from './client-allowed-scopes.loader'
import { ClientAllowedScopesLoader } from './client-allowed-scopes.loader'

@UseGuards(IdsUserGuard)
@Resolver(() => ClientEnvironment)
export class ClientEnvironmentResolver {
  @ResolveField('secrets', () => [ClientSecret])
  async resolveClientSecret(
    @Loader(ClientSecretLoader) clientSecretLoader: ClientSecretDataLoader,
    @Parent() { environment, tenantId, clientId }: ClientEnvironment,
  ): Promise<ClientSecret[]> {
    return clientSecretLoader.load({
      environment,
      tenantId,
      clientId,
    })
  }

  @ResolveField('allowedScopes', () => [ClientAllowedScope], { nullable: true })
  async resolveAllowedScopes(
    @Loader(ClientAllowedScopesLoader)
    apiScopeLoader: ClientAllowedScopesDataLoader,
    @Parent()
    { tenantId, clientId, environment }: ClientEnvironment,
  ): Promise<ClientAllowedScope[]> {
    return apiScopeLoader.load({
      tenantId,
      clientId,
      environment,
    })
  }
}
