import { Injectable } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CreateClientType,
  MeClientsControllerCreateRequest,
  MeClientsControllerUpdateRequest,
} from '@island.is/clients/auth/admin-api'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { ClientSecretInput } from './dto/client-secret.input'
import { CreateClientInput } from './dto/create-client.input'
import { CreateClientResponse } from './dto/create-client.response'
import { PatchClientInput } from './dto/patch-client.input'
import { PublishClientInput } from './dto/publish-client.input'
import { ClientAllowedScopeInput } from './dto/client-allowed-scope.input'
import { ClientEnvironment } from './models/client-environment.model'
import { ClientSecret } from './models/client-secret.model'
import { Client } from './models/client.model'
import { ClientAllowedScope } from './models/client-allowed-scope.model'
import { ClientAvailableScopeInput } from './dto/client-available-scope.input'
import { environments } from '../shared/constants/environments'

@Injectable()
export class ClientsService extends MultiEnvironmentService {
  async getClients(user: User, tenantId: string) {
    const clients = await Promise.all([
      this.adminDevApiWithAuth(user)
        ?.meClientsControllerFindByTenantId({
          tenantId,
        })
        .catch((error) => this.handleError(error, Environment.Development)),
      this.adminStagingApiWithAuth(user)
        ?.meClientsControllerFindByTenantId({
          tenantId,
        })
        .catch((error) => this.handleError(error, Environment.Staging)),
      this.adminProdApiWithAuth(user)
        ?.meClientsControllerFindByTenantId({
          tenantId,
        })
        .catch((error) => this.handleError(error, Environment.Production)),
    ])

    const clientsMap = new Map<string, ClientEnvironment[]>()

    for (const [index, env] of environments.entries()) {
      for (const client of clients[index] ?? []) {
        if (!clientsMap.has(client.clientId)) {
          clientsMap.set(client.clientId, [])
        }

        // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
        clientsMap.get(client.clientId)!.push({
          ...client,
          id: this.formatClientId(client.clientId, env),
          environment: env,
        })
      }
    }

    const clientsArray: Client[] = []
    for (const [clientId, environments] of clientsMap.entries()) {
      clientsArray.push({
        clientId,
        clientType: environments[0].clientType,
        environments,
      })
    }

    clientsArray.sort((a, b) => a.clientId.localeCompare(b.clientId))

    return {
      data: clientsArray,
      totalCount: clientsArray.length,
      pageInfo: { hasNextPage: false },
    }
  }

  async getClientById(
    user: User,
    tenantId: string,
    clientId: string,
  ): Promise<Client> {
    const clients = await Promise.all([
      this.adminDevApiWithAuth(user)
        ?.meClientsControllerFindByTenantIdAndClientId({ tenantId, clientId })
        .catch((error) => this.handleError(error, Environment.Development)),
      this.adminStagingApiWithAuth(user)
        ?.meClientsControllerFindByTenantIdAndClientId({ tenantId, clientId })
        .catch((error) => this.handleError(error, Environment.Staging)),
      this.adminProdApiWithAuth(user)
        ?.meClientsControllerFindByTenantIdAndClientId({ tenantId, clientId })
        .catch((error) => this.handleError(error, Environment.Production)),
    ])

    const clientEnvs: ClientEnvironment[] = []
    for (const [index, env] of environments.entries()) {
      const client = clients[index]
      if (client) {
        clientEnvs.push({
          ...client,
          id: this.formatClientId(clientId, env),
          environment: env,
        })
      }
    }

    return {
      clientId,
      clientType: clientEnvs[0].clientType,
      environments: clientEnvs,
    }
  }

  async createClient(
    user: User,
    input: CreateClientInput,
  ): Promise<CreateClientResponse[]> {
    const applicationRequest: MeClientsControllerCreateRequest = {
      tenantId: input.tenantId,
      adminCreateClientDto: {
        clientId: input.clientId,
        clientType: (input.clientType as string) as CreateClientType,
        clientName: input.displayName,
      },
    }

    const settledPromises = await Promise.allSettled(
      input.environments.map(async (environment) => {
        return this.adminApiByEnvironmentWithAuth(
          environment,
          user,
        )?.meClientsControllerCreate(applicationRequest)
      }),
    )

    return this.handleSettledPromises(settledPromises, {
      mapper: (client, index) => ({
        clientId: client.clientId,
        environment: input.environments[index],
      }),
      prefixErrorMessage: `Failed to create application ${input.clientId}`,
    })
  }

  async patchClient(
    user: User,
    input: PatchClientInput,
  ): Promise<ClientEnvironment[]> {
    const { clientId, tenantId, environments, ...adminPatchClientDto } = input

    if (Object.keys(adminPatchClientDto).length === 0) {
      throw new Error('Nothing provided to update')
    }

    const updateData: MeClientsControllerUpdateRequest = {
      tenantId: input.tenantId,
      clientId: input.clientId,
      adminPatchClientDto: adminPatchClientDto,
    }

    const updated = await Promise.allSettled(
      input.environments.map(async (environment) => {
        return this.adminApiByEnvironmentWithAuth(
          environment,
          user,
        )?.meClientsControllerUpdate(updateData)
      }),
    )

    return this.handleSettledPromises(updated, {
      mapper: (client, index) => ({
        ...client,
        id: this.formatClientId(client.clientId, input.environments[index]),
        environment: input.environments[index],
      }),
      prefixErrorMessage: `Failed to update application ${input.clientId}`,
    })
  }

  async getClientSecrets(
    user: User,
    input: ClientSecretInput,
  ): Promise<ClientSecret[]> {
    const secrets = await this.adminApiByEnvironmentWithAuth(
      input.environment,
      user,
    )?.meClientSecretsControllerFindAll({
      tenantId: input.tenantId,
      clientId: input.clientId,
    })

    return secrets ?? []
  }

  async publishClient(
    user: User,
    input: PublishClientInput,
  ): Promise<ClientEnvironment> {
    // Fetch the client from source environment

    const sourceInput = await this.adminApiByEnvironmentWithAuth(
      input.sourceEnvironment,
      user,
    )
      ?.meClientsControllerFindByTenantIdAndClientId({
        tenantId: input.tenantId,
        clientId: input.clientId,
      })
      .catch((error) => this.handleError(error, input.sourceEnvironment))

    if (!sourceInput) {
      throw new Error(`Client ${input.clientId} not found`)
    }

    const created = await this.adminApiByEnvironmentWithAuth(
      input.targetEnvironment,
      user,
    )?.meClientsControllerCreate({
      tenantId: input.tenantId,
      adminCreateClientDto: {
        ...sourceInput,
        clientId: input.clientId,
        clientType:
          CreateClientType[
            sourceInput.clientType as keyof typeof CreateClientType
          ],
        clientName:
          sourceInput.displayName.find(({ locale }) => locale === 'is')
            ?.value || sourceInput.clientId,
        //exclude the uris
        postLogoutRedirectUris: [],
        redirectUris: [],
      },
    })

    if (!created) {
      throw new Error(
        `Failed to create client ${input.clientId} on ${input.targetEnvironment}`,
      )
    }

    return {
      ...created,
      id: this.formatClientId(created.clientId, input.targetEnvironment),
      environment: input.targetEnvironment,
    }
  }

  private formatClientId(clientId: string, environment: Environment) {
    return `${clientId}#${environment}`
  }

  async getAllowedScopes(
    user: User,
    input: ClientAllowedScopeInput,
  ): Promise<ClientAllowedScope[]> {
    const apiScopes = await this.adminApiByEnvironmentWithAuth(
      input.environment,
      user,
    )?.meClientsScopesControllerFindAll({
      tenantId: input.tenantId,
      clientId: input.clientId,
    })

    return (
      apiScopes?.map(({ name, displayName, description }) => ({
        name,
        displayName,
        description,
      })) ?? []
    )
  }

  async getScopesByTenantId(
    input: ClientAvailableScopeInput,
    user: User,
  ): Promise<ClientAllowedScope[]> {
    const apiScopes = await this.adminApiByEnvironmentWithAuth(
      input.environment,
      user,
    )?.meScopesControllerFindAllByTenantId({
      tenantId: input.tenantId,
    })

    return apiScopes ?? []
  }
}
