import { UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

import { ClientsService } from './clients.service'
import { ClientEnvironment } from './models/client-environment.model'
import { ClientSecret } from './models/client-secret.model'

@UseGuards(IdsUserGuard)
@Resolver(() => ClientEnvironment)
export class ClientEnvironmentResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @ResolveField('secrets', () => [ClientSecret])
  async resolveClientSecret(
    @CurrentUser() user: User,
    @Parent() clientEnvironment: ClientEnvironment,
  ): Promise<ClientSecret[]> {
    return this.clientsService.getClientSecret(user, clientEnvironment)
  }
}
