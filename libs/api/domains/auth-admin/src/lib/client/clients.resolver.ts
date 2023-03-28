import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Environment } from '@island.is/shared/types'

import { ClientsService } from './clients.service'
import { ClientsPayload } from './dto/clients.payload'
import { Client } from './models/client.model'
import { ClientEnvironment } from './models/client-environment.model'
import { ClientInput } from './dto/client.input'
import { CreateClientResponse } from './dto/create-client.response'
import { CreateClientInput } from './dto/create-client.input'

@UseGuards(IdsUserGuard)
@Resolver(() => Client)
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @Query(() => ClientsPayload, { name: 'authAdminClients' })
  getClients(
    @CurrentUser() user: User,
    @Args('tenantId') tenantId: string,
  ): Promise<ClientsPayload> {
    return this.clientsService.getClients(user, tenantId)
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

  @ResolveField('defaultEnvironment', () => ClientEnvironment)
  resolveDefaultEnvironment(@Parent() application: Client): ClientEnvironment {
    if (application.environments.length === 0) {
      throw new Error(`Application ${application.clientId} has no environments`)
    }

    // Depends on the priority order being decided in the service
    return application.environments[0]
  }

  @ResolveField('availableEnvironments', () => [Environment])
  resolveAvailableEnvironments(@Parent() application: Client): Environment[] {
    return application.environments.map((env) => env.environment)
  }
}
