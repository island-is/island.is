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
import { ApplicationsPayload } from './dto/applications-payload'
import { Client } from './models/client.model'
import { ClientEnvironment } from './models/client-environment.model'
import { ClientInput } from './dto/client-input'
import { CreateApplicationResponseDto } from './dto/create-application-response'
import { CreateClientsInput } from './dto/createClientsInput'

@UseGuards(IdsUserGuard)
@Resolver(() => Client)
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @Query(() => ApplicationsPayload, { name: 'authAdminClients' })
  getClients(@CurrentUser() user: User, @Args('tenantId') tenantId: string) {
    return this.clientsService.getClients(tenantId, user)
  }

  @Query(() => Client, { name: 'authAdminClient' })
  getClientById(@Args('input') input: ClientInput) {
    return this.clientsService.getClientById(input.tenantId, input.clientId)
  }

  @Mutation(() => [CreateApplicationResponseDto], {
    name: 'createAuthAdminApplication',
  })
  createClient(
    @Args('input', { type: () => CreateClientsInput })
    input: CreateClientsInput,
    @CurrentUser() user: User,
  ) {
    return this.clientsService.createApplication(input, user)
  }

  @ResolveField('defaultEnvironment', () => ClientEnvironment)
  resolveDefaultEnvironment(@Parent() application: Client): ClientEnvironment {
    if (application.environments.length === 0) {
      throw new Error(`Application ${application.clientId} has no environments`)
    }

    // Depends on the priority order being decided by the backend
    return application.environments[0]
  }

  @ResolveField('availableEnvironments', () => [Environment])
  resolveAvailableEnvironments(@Parent() application: Client): Environment[] {
    return application.environments.map((env) => env.environment)
  }
}
