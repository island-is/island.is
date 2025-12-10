import { Injectable } from '@nestjs/common'
import groupBy from 'lodash/groupBy'

import type { User } from '@island.is/auth-nest-tools'
import {
  CreateClientType,
  MeClientsControllerCreateRequest,
  ClientSso,
} from '@island.is/clients/auth/admin-api'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { ClientSecretInput } from './dto/client-secret.input'
import { CreateClientInput } from './dto/create-client.input'
import { CreateClientResponse } from './dto/create-client.response'
import { PatchClientInput } from './dto/patch-client.input'
import { PublishClientInput } from './dto/publish-client.input'
import { ClientAllowedScopeInput } from './dto/client-allowed-scope.input'
import { RotateSecretInput } from './dto/rotate-secret.input'
import { ClientEnvironment } from './models/client-environment.model'
import { ClientSecret } from './models/client-secret.model'
import { Client } from './models/client.model'
import { ClientAllowedScope } from './models/client-allowed-scope.model'
import { environments } from '../shared/constants/environments'
import { DeleteClientInput } from './dto/delete-client.input'
import { ClientsPayload } from './dto/clients.payload'
import { RevokeSecretsInput } from './dto/revoke-secrets.input'

@Injectable()
export class ClientsService extends MultiEnvironmentService {
  async getClients(user: User, tenantId: string): Promise<ClientsPayload> {
    const clientsSettledPromises = await Promise.allSettled(
      environments.map(async (environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meClientsControllerFindByTenantIdRaw({
            tenantId,
          }),
        ),
      ),
    )

    const clientsEnvironments = this.handleSettledPromises(
      clientsSettledPromises,
      {
        mapper: (clients, index): ClientEnvironment[] =>
          clients.map(
            (client): ClientEnvironment => ({
              ...client,
              id: this.formatClientId(client.clientId, environments[index]),
              environment: environments[index],
            }),
          ),
        prefixErrorMessage: `Failed to find applications for tenant ${tenantId}`,
      },
    ).flat()

    const groupedClients = groupBy(clientsEnvironments, 'clientId')

    const clients: Client[] = Object.entries(groupedClients)
      .map(([clientId, clients]) => ({
        clientId,
        clientType: clients[0].clientType,
        sso: clients[0].sso,
        environments: clients,
      }))
      .sort((a, b) => a.clientId.localeCompare(b.clientId))

    return {
      data: clients,
      totalCount: clients.length,
      pageInfo: { hasNextPage: false },
    }
  }

  async getClientById(
    user: User,
    tenantId: string,
    clientId: string,
    includeArchived = false,
  ): Promise<Client | null> {
    const settledClientsPromises = await Promise.allSettled(
      environments.map(async (environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meClientsControllerFindByTenantIdAndClientIdRaw({
            tenantId,
            clientId,
            includeArchived,
          }),
        ),
      ),
    )

    const clientEnvs: ClientEnvironment[] = this.handleSettledPromises(
      settledClientsPromises,
      {
        mapper: (client, index) => ({
          ...client,
          id: this.formatClientId(clientId, environments[index]),
          environment: environments[index],
        }),
        prefixErrorMessage: `Failed to find application ${clientId}`,
      },
    )

    // If no client is found for all environments then we return null
    if (clientEnvs.length === 0) return null

    return {
      clientId,
      clientType: clientEnvs[0].clientType,
      sso: clientEnvs[0].sso,
      environments: clientEnvs,
    }
  }

  async createClient(
    user: User,
    input: CreateClientInput,
  ): Promise<CreateClientResponse[]> {
    const settledPromises = await Promise.allSettled(
      input.environments.map(async (environment) => {
        const tenant = await this.makeRequest(user, environment, (api) =>
          api.meTenantsControllerFindByIdRaw({
            tenantId: input.tenantId,
          }),
        )

        const applicationRequest: MeClientsControllerCreateRequest = {
          tenantId: input.tenantId,
          adminCreateClientDto: {
            clientId: input.clientId,
            clientType: input.clientType as string as CreateClientType,
            clientName: input.displayName,
            contactEmail: tenant?.contactEmail,
            supportedDelegationTypes: input.supportedDelegationTypes,
            sso: (input.sso as ClientSso) || ClientSso.disabled,
          },
        }

        return this.makeRequest(user, environment, (api) =>
          api.meClientsControllerCreateRaw(applicationRequest),
        )
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
    {
      clientId,
      tenantId,
      environments,
      ...adminPatchClientDto
    }: PatchClientInput,
  ): Promise<ClientEnvironment[]> {
    if (Object.keys(adminPatchClientDto).length === 0) {
      throw new Error('Nothing provided to update')
    }

    const updated = await Promise.allSettled(
      environments.map(async (environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meClientsControllerUpdateRaw({
            tenantId,
            clientId,
            adminPatchClientDto,
          }),
        ),
      ),
    )

    return this.handleSettledPromises(updated, {
      mapper: (client, index) => ({
        ...client,
        id: this.formatClientId(client.clientId, environments[index]),
        environment: environments[index],
      }),
      prefixErrorMessage: `Failed to update application ${clientId}`,
    })
  }

  async getClientSecrets(
    user: User,
    { environment, clientId, tenantId }: ClientSecretInput,
  ): Promise<ClientSecret[]> {
    const secrets = await this.makeRequest(user, environment, (api) =>
      api.meClientSecretsControllerFindAllRaw({
        tenantId,
        clientId,
      }),
    )

    return secrets ?? []
  }

  async publishClient(
    user: User,
    {
      sourceEnvironment,
      targetEnvironment,
      clientId,
      tenantId,
    }: PublishClientInput,
  ): Promise<ClientEnvironment> {
    // Fetch the client from source environment
    const sourceInput = await this.makeRequest(
      user,
      sourceEnvironment,
      (sourceApi) =>
        sourceApi.meClientsControllerFindByTenantIdAndClientIdRaw({
          tenantId,
          clientId,
          includeArchived: false,
        }),
    )

    if (!sourceInput) {
      throw new Error(`Client ${clientId} not found in ${sourceEnvironment}`)
    }

    const created = await this.makeRequest(
      user,
      targetEnvironment,
      (targetApi) =>
        targetApi.meClientsControllerCreateRaw({
          tenantId,
          adminCreateClientDto: {
            ...sourceInput,
            clientId,
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
        }),
    )

    if (!created) {
      throw new Error(
        `Failed to create client ${clientId} on ${targetEnvironment}`,
      )
    }

    return {
      ...created,
      id: this.formatClientId(created.clientId, targetEnvironment),
      environment: targetEnvironment,
    }
  }

  private formatClientId(clientId: string, environment: Environment) {
    return `${clientId}#${environment}`
  }

  async getAllowedScopes(
    user: User,
    { environment, clientId, tenantId }: ClientAllowedScopeInput,
  ): Promise<ClientAllowedScope[]> {
    const apiScopes = await this.makeRequest(user, environment, (api) =>
      api.meClientsScopesControllerFindAllRaw({
        tenantId,
        clientId,
      }),
    )

    return (
      apiScopes?.map(({ name, displayName, description, domainName }) => ({
        name,
        displayName,
        description,
        domainName,
      })) ?? []
    )
  }

  async rotateSecret(
    user: User,
    { environment, revokeOldSecrets, clientId, tenantId }: RotateSecretInput,
  ): Promise<ClientSecret> {
    if (revokeOldSecrets) {
      const secrets = await this.makeRequest(user, environment, (api) =>
        api.meClientSecretsControllerFindAllRaw({
          tenantId,
          clientId,
        }),
      )

      if (secrets && secrets.length > 0) {
        // We don't care about the result of the delete as we can't have it in a single transaction between environments.
        // If it fails the UI will prompt the user about there being old secrets and they can clear them.
        await Promise.allSettled(
          secrets.map((secret) =>
            this.makeRequest(user, environment, (api) =>
              api.meClientSecretsControllerDeleteRaw({
                tenantId,
                clientId,
                secretId: secret.secretId,
              }),
            ),
          ),
        )
      }
    }

    const newSecret = await this.makeRequest(user, environment, (api) =>
      api.meClientSecretsControllerCreateRaw({
        tenantId,
        clientId,
      }),
    )

    if (!newSecret) {
      throw new Error(
        `Failed to create secret for client ${clientId} in ${environment}`,
      )
    }

    return newSecret
  }

  async deleteClient(user: User, input: DeleteClientInput): Promise<boolean> {
    const targets = environments.map((env) => ({
      environment: env,
      success: true,
    }))

    await Promise.all(
      targets.map(async (target) => {
        const response = await this.makeRequest(
          user,
          target.environment,
          (api) =>
            api.meClientsControllerDeleteRaw({
              tenantId: input.tenantId,
              clientId: input.clientId,
            }),
        ).catch((error) => {
          target.success = false
          this.handleError(error, target.environment)
        })

        if (!response) {
          target.success = false
        }
      }),
    )

    return targets.some((target) => target.success)
  }

  async revokeSecret(
    user: User,
    { environment, clientId, tenantId }: RevokeSecretsInput,
  ) {
    // We consider the first secret to be the active one and the rest as the old secrets to revoke
    const [_, ...oldSecrets] =
      (await this.makeRequest(user, environment, (api) =>
        api.meClientSecretsControllerFindAllRaw({
          tenantId,
          clientId,
        }),
      )) ?? []

    // We revoke the old secrets
    if (oldSecrets && oldSecrets.length > 0) {
      await Promise.all(
        oldSecrets.map((secret) =>
          this.makeRequest(user, environment, (api) =>
            api.meClientSecretsControllerDeleteRaw({
              tenantId,
              clientId,
              secretId: secret.secretId,
            }),
          ),
        ),
      )
    }

    return true
  }
}
