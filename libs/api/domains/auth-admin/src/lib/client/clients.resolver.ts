import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { Environment } from '@island.is/shared/types'

import { ClientsService } from './clients.service'
import { ClientsPayload } from './dto/clients.payload'
import { Client } from './models/client.model'
import { ClientEnvironment } from './models/client-environment.model'
import { ClientInput } from './dto/client.input'
import { ClientsInput } from './dto/clients.input'
import { CreateClientResponse } from './dto/create-client.response'
import { CreateClientInput } from './dto/create-client.input'
import { PatchClientInput } from './dto/patch-client.input'

@UseGuards(IdsUserGuard)
@Resolver(() => Client)
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @Query(() => ClientsPayload, { name: 'authAdminClients' })
  getClients(
    @CurrentUser() user: User,
    @Args('input') input: ClientsInput,
  ): Promise<ClientsPayload> {
    return this.clientsService.getClients(user, input.tenantId)
  }

  @Query(() => Client, { name: 'authAdminClient' })
  getClientById(
    @CurrentUser() user: User,
    @Args('input') input: ClientInput,
  ): Promise<Client> {
    return this.clientsService.getClientById(
      user,
      input.tenantId,
      input.clientId,
    )
  }

  @Mutation(() => [CreateClientResponse], {
    name: 'createAuthAdminClient',
  })
  createClient(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateClientInput })
    input: CreateClientInput,
  ) {
    return this.clientsService.createClient(user, input)
  }

  @Mutation(() => [ClientEnvironment], {
    name: 'patchAuthAdminClient',
  })
  patchClient(
    @CurrentUser() user: User,
    @Args('input', { type: () => PatchClientInput }) input: PatchClientInput,
  ) {
    return this.clientsService.patchClient(user, input)
  }

  @ResolveField('defaultEnvironment', () => ClientEnvironment)
  resolveDefaultEnvironment(@Parent() client: Client): ClientEnvironment {
    if (client.environments.length === 0) {
      throw new Error(`Client ${client.clientId} has no environments`)
    }

    // Depends on the priority order being decided in the service
    return client.environments[0]
  }

  @ResolveField('availableEnvironments', () => [Environment])
  resolveAvailableEnvironments(@Parent() client: Client): Environment[] {
    return client.environments.map((env) => env.environment)
  }
}
