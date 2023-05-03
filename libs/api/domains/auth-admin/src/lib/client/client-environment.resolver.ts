import { UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { ClientsService } from './clients.service'
import { ClientEnvironment } from './models/client-environment.model'
import { ClientSecret } from './models/client-secret.model'
import { ClientSecretLoader } from './client-secret.loader'
import type { ClientSecretDataLoader } from './client-secret.loader'
import { Loader } from '@island.is/nest/dataloader'

@UseGuards(IdsUserGuard)
@Resolver(() => ClientEnvironment)
export class ClientEnvironmentResolver {
  constructor(private readonly clientsService: ClientsService) {}

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
}
