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
import { PublishClientInput } from './dto/publish-client.input'
import { RevokeSecretsInput } from './dto/revoke-secrets.input'
import { RotateSecretInput } from './dto/rotate-secret.input'
import { ClientSecret } from './models/client-secret.model'
import { DeleteClientInput } from './dto/delete-client.input'

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

  @Query(() => Client, { name: 'authAdminClient', nullable: true })
  getClientById(
    @CurrentUser() user: User,
    @Args('input') input: ClientInput,
  ): Promise<Client | null> {
    return this.clientsService.getClientById(
      user,
      input.tenantId,
      input.clientId,
      input.includeArchived,
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

  @Mutation(() => ClientEnvironment, {
    name: 'publishAuthAdminClient',
  })
  publishClient(
    @CurrentUser() user: User,
    @Args('input', { type: () => PublishClientInput })
    input: PublishClientInput,
  ) {
    return this.clientsService.publishClient(user, input)
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

  @Mutation(() => ClientSecret, { name: 'rotateAuthAdminClientSecret' })
  rotateSecret(
    @CurrentUser() user: User,
    @Args('input', { type: () => RotateSecretInput }) input: RotateSecretInput,
  ): Promise<ClientSecret> {
    return this.clientsService.rotateSecret(user, input)
  }

  @Mutation(() => Boolean, { name: 'deleteAuthAdminClient' })
  deleteClient(
    @CurrentUser() user: User,
    @Args('input', { type: () => DeleteClientInput }) input: DeleteClientInput,
  ): Promise<boolean> {
    return this.clientsService.deleteClient(user, input)
  }

  @Mutation(() => Boolean, { name: 'revokeAuthAdminClientSecrets' })
  revokeSecret(
    @CurrentUser() user: User,
    @Args('input', { type: () => RevokeSecretsInput })
    input: RevokeSecretsInput,
  ): Promise<boolean> {
    return this.clientsService.revokeSecret(user, input)
  }

  @ResolveField('defaultEnvironment', () => ClientEnvironment)
  resolveDefaultEnvironment(@Parent() client: Client): ClientEnvironment {
    if (client.environments.length === 0) {
      throw new Error(`Client ${client.clientId} has no environments`)
    }

    // Depends on the priority order being decided in the service
    return client.environments[client.environments.length - 1]
  }

  @ResolveField('availableEnvironments', () => [Environment])
  resolveAvailableEnvironments(@Parent() client: Client): Environment[] {
    return client.environments.map((env) => env.environment)
  }
}
