import { UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { Loader } from '@island.is/nest/dataloader'
import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { ClientEnvironment } from './models/client-environment.model'
import { AllowedScope } from './models/allowed-scope.model'
import {
  ClientAllowedScopesDataLoader,
  ClientAllowedScopesLoader,
} from './client-allowed-scopes.loader'

@UseGuards(IdsUserGuard)
@Resolver(() => ClientEnvironment)
export class ClientEnvironmentResolver {
  @ResolveField('allowedScopes', () => [AllowedScope], { nullable: true })
  async resolveAllowedScopes(
    @Loader(ClientAllowedScopesLoader)
    apiScopeLoader: ClientAllowedScopesDataLoader,
    @Parent()
    { tenantId, clientId, environment }: ClientEnvironment,
  ): Promise<AllowedScope[]> {
    return apiScopeLoader.load({
      tenantId,
      clientId,
      environment,
    })
  }
}
