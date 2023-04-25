import { Injectable } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CreateClientType,
  MeClientsControllerCreateRequest,
  MeClientsControllerUpdateRequest,
} from '@island.is/clients/auth/admin-api'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { CreateClientInput } from './dto/create-client.input'
import { CreateClientResponse } from './dto/create-client.response'
import { ClientEnvironment } from './models/client-environment.model'
import { Client } from './models/client.model'
import { PatchClientInput } from './dto/patch-client.input'

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

    for (const [index, env] of [
      Environment.Development,
      Environment.Staging,
      Environment.Production,
    ].entries()) {
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
    for (const [index, env] of [
      Environment.Development,
      Environment.Staging,
      Environment.Production,
    ].entries()) {
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

    const createApplicationResponse = [] as CreateClientResponse[]

    const created = await Promise.allSettled(
      input.environments.map(async (environment) => {
        return this.adminApiByEnvironmentWithAuth(
          environment,
          user,
        )?.meClientsControllerCreate(applicationRequest)
      }),
    )

    created.map((resp, index) => {
      if (resp.status === 'fulfilled' && resp.value) {
        createApplicationResponse.push({
          clientId: resp.value.clientId,
          environment: input.environments[index],
        })
      } else if (resp.status === 'rejected') {
        this.logger.error(
          `Failed to create application ${input.clientId} in environment ${input.environments[index]}`,
          resp.reason,
        )
      }
    })

    return createApplicationResponse
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

    const patchClientResponses = [] as ClientEnvironment[]

    updated.map((resp, index) => {
      if (resp.status === 'fulfilled' && resp.value) {
        patchClientResponses.push({
          ...resp.value,
          id: this.formatClientId(
            resp.value.clientId,
            input.environments[index],
          ),
          environment: input.environments[index],
        })
      } else if (resp.status === 'rejected') {
        this.logger.error(
          `Failed to update application ${input.clientId} in environment ${input.environments[index]}`,
          resp.reason,
        )
      }
    })

    return patchClientResponses
  }

  private formatClientId(clientId: string, environment: Environment) {
    return `${clientId}#${environment}`
  }
}
