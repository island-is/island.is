import { Injectable } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  ClientType,
  MeClientsControllerCreateRequest,
} from '@island.is/clients/auth/admin-api'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { CreateClientsInput } from './dto/createClientsInput'
import { CreateApplicationResponseDto } from './dto/create-application-response'
import { ClientEnvironment } from './models/client-environment.model'
import { Client } from './models/client.model'

@Injectable()
export class ClientsService extends MultiEnvironmentService {
  async getClients(tenantId: string, user: User) {
    const clients = await Promise.all([
      this.adminDevApiWithAuth(user)
        ?.meClientsControllerFindByTenantId({
          tenantId,
        })
        .catch(this.handleError.bind(this)),
      ,
      this.adminStagingApiWithAuth(user)
        ?.meClientsControllerFindByTenantId({
          tenantId,
        })
        .catch(this.handleError.bind(this)),
      ,
      this.adminProdApiWithAuth(user)
        ?.meClientsControllerFindByTenantId({
          tenantId,
        })
        .catch(this.handleError.bind(this)),
      ,
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
          id: `${client.clientId}#${env}`,
          clientId: client.clientId,
          environment: env,
          clientType: client.clientType,
          displayName: client.displayName,
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

    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    clientsArray.sort((a, b) => a.clientId!.localeCompare(b.clientId!))

    return {
      data: clientsArray,
      totalCount: clientsArray.length,
      pageInfo: { hasNextPage: false },
    }
  }

  getClientById(tenantId: string, clientId: string) {
    const resp = getMockData()
    resp.data = resp.data.filter((x) => {
      return x.tenantId === tenantId && x.applicationId === clientId
    })

    return resp.data[0]
  }

  async createApplication(
    input: CreateClientsInput,
    user: User,
  ): Promise<CreateApplicationResponseDto[]> {
    const applicationRequest: MeClientsControllerCreateRequest = {
      tenantId: input.tenantId,
      adminCreateClientDto: {
        clientId: input.applicationId,
        clientType: (input.applicationType as string) as ClientType,
        clientName: input.displayName,
      },
    }

    const createApplicationResponse = [] as CreateApplicationResponseDto[]

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
          applicationId: resp.value.clientId,
          environment: input.environments[index],
        })
      } else if (resp.status === 'rejected') {
        this.logger.error(
          `Failed to create application ${input.applicationId} in environment ${input.environments[index]}`,
          resp.reason,
        )
      }
    })

    return createApplicationResponse
  }
}

const getMockData = () => {
  return {
    data: [
      {
        applicationId: '@island.is/web',
        applicationType: ClientType.web,
        tenantId: '@island.is',
        environments: [
          {
            name: '@island.is/web',
            environment: Environment.Development,
            displayName: [
              {
                locale: 'is',
                value: 'Ísland.is Web',
              },
            ],
            basicInfo: {
              applicationId: '@hugverk.is/web/hugverkastofa-dev',
              applicationSecret: 'secret',
              idsURL: 'http://innskra.island.is',
              oAuthAuthorizationUrl: 'http://innskra.island.is/authorize',
              deviceAuthorizationUrl: 'http://innskra.island.is/oauth/device',
              oAuthTokenUrl: 'http://innskra.island.is/oauth/token ',
              oAuthUserInfoUrl: 'http://innskra.island.is/userinfo',
              openIdConfiguration: 'http://innskra.island.is/openid',
              jsonWebKeySet: 'http://innskra.island.is/web-key',
            },
            applicationUrls: {
              callbackUrls: [
                'http://localhost:4200/callbackdev',
                'http://localhost:4200/callback2dev',
              ],
              logoutUrls: [
                'http://localhost:4200/logout',
                'http://localhost:4200/logout2',
              ],
              cors: ['http://localhost:4200', 'http://localhost:4200'],
            },
            lifeTime: {
              absoluteLifeTime: 2592000,
              inactivityExpiration: false,
              inactivityLifeTime: 1296000,
            },
          },
          {
            name: '@island.is/web',
            environment: Environment.Staging,
            displayName: [
              {
                locale: 'is',
                value: 'Ísland.is Web',
              },
            ],
            basicInfo: {
              applicationId: '@hugverk.is/web/hugverkastofa-staging',
              applicationSecret: 'secret',
              idsURL: 'http://innskra.island.is',
              oAuthAuthorizationUrl: 'http://innskra.island.is/authorize',
              deviceAuthorizationUrl: 'http://innskra.island.is/oauth/device',
              oAuthTokenUrl: 'http://innskra.island.is/oauth/token ',
              oAuthUserInfoUrl: 'http://innskra.island.is/userinfo',
              openIdConfiguration: 'http://innskra.island.is/openid',
              jsonWebKeySet: 'http://innskra.island.is/web-key',
            },
            applicationUrls: {
              callbackUrls: [
                'http://localhost:4200/callback',
                'http://localhost:4200/callback2',
              ],
              logoutUrls: [
                'http://localhost:4200/logout',
                'http://localhost:4200/logout2',
              ],
              cors: ['http://localhost:4200', 'http://localhost:4200'],
            },
            lifeTime: {
              absoluteLifeTime: 2592000,
              inactivityExpiration: false,
              inactivityLifeTime: 1296000,
            },
          },
        ],
      },
      {
        applicationId: '@island.is/auth-admin-web',
        applicationType: ClientType.web,
        tenantId: '@admin.island.is',
        environments: [
          {
            name: '@island.is/auth-admin-web',
            environment: Environment.Development,
            displayName: [
              {
                locale: 'is',
                value: 'Auth Admin Web - IS',
              },
              {
                locale: 'en',
                value: 'Auth Admin Web',
              },
            ],
            basicInfo: {
              applicationId: '@hugverk.is/web/hugverkastofa-dev',
              applicationSecret: 'secret',
              idsURL: 'http://innskra.island.is',
              oAuthAuthorizationUrl: 'http://innskra.island.is/authorize',
              deviceAuthorizationUrl: 'http://innskra.island.is/oauth/device',
              oAuthTokenUrl: 'http://innskra.island.is/oauth/token ',
              oAuthUserInfoUrl: 'http://innskra.island.is/userinfo',
              openIdConfiguration: 'http://innskra.island.is/openid',
              jsonWebKeySet: 'http://innskra.island.is/web-key',
            },
            applicationUrls: {
              callbackUrls: [
                'http://localhost:4200/callbackdev',
                'http://localhost:4200/callback2dev',
              ],
              logoutUrls: [
                'http://localhost:4200/logout',
                'http://localhost:4200/logout2',
              ],
              cors: ['http://localhost:4200', 'http://localhost:4200'],
            },
            lifeTime: {
              absoluteLifeTime: 2592000,
              inactivityExpiration: false,
              inactivityLifeTime: 1296000,
            },
          },
          {
            name: '@island.is/auth-admin-web',
            environment: Environment.Staging,
            displayName: [
              {
                locale: 'is',
                value: 'Auth Admin Web',
              },
            ],
            basicInfo: {
              applicationId: '@hugverk.is/web/hugverkastofa-staging',
              applicationSecret: 'secret',
              idsURL: 'http://innskra.island.is',
              oAuthAuthorizationUrl: 'http://innskra.island.is/authorize',
              deviceAuthorizationUrl: 'http://innskra.island.is/oauth/device',
              oAuthTokenUrl: 'http://innskra.island.is/oauth/token ',
              oAuthUserInfoUrl: 'http://innskra.island.is/userinfo',
              openIdConfiguration: 'http://innskra.island.is/openid',
              jsonWebKeySet: 'http://innskra.island.is/web-key',
            },
            applicationUrls: {
              callbackUrls: [
                'http://localhost:4200/callback',
                'http://localhost:4200/callback2',
              ],
              logoutUrls: [
                'http://localhost:4200/logout',
                'http://localhost:4200/logout2',
              ],
              cors: ['http://localhost:4200', 'http://localhost:4200'],
            },
            lifeTime: {
              absoluteLifeTime: 2592000,
              inactivityExpiration: false,
              inactivityLifeTime: 1296000,
            },
          },
          {
            name: '@island.is/auth-admin-web',
            environment: Environment.Production,
            displayName: [
              {
                locale: 'is',
                value: 'Auth Admin Web',
              },
            ],
            basicInfo: {
              applicationId: '@hugverk.is/web/hugverkastofa-prod',
              applicationSecret: 'secret',
              idsURL: 'http://innskra.island.is',
              oAuthAuthorizationUrl: 'http://innskra.island.is/authorize',
              deviceAuthorizationUrl: 'http://innskra.island.is/oauth/device',
              oAuthTokenUrl: 'http://innskra.island.is/oauth/token ',
              oAuthUserInfoUrl: 'http://innskra.island.is/userinfo',
              openIdConfiguration: 'http://innskra.island.is/openid',
              jsonWebKeySet: 'http://innskra.island.is/web-key',
            },
            applicationUrls: {
              callbackUrls: [],
              logoutUrls: [],
              cors: [],
            },
            lifeTime: {
              absoluteLifeTime: 2592000,
              inactivityExpiration: false,
              inactivityLifeTime: 1296000,
            },
          },
        ],
      },
      {
        applicationId: '@island.is/auth',
        applicationType: ClientType.web,
        tenantId: '@admin.island.is',
        environments: [
          {
            name: '@island.is/auth',
            environment: Environment.Development,
            displayName: [
              {
                locale: 'is',
                value: 'Auth',
              },
            ],
            basicInfo: {
              applicationId: '@hugverk.is/web/hugverkastofa-prod',
              applicationSecret: 'secret',
              idsURL: 'http://innskra.island.is',
              oAuthAuthorizationUrl: 'http://innskra.island.is/authorize',
              deviceAuthorizationUrl: 'http://innskra.island.is/oauth/device',
              oAuthTokenUrl: 'http://innskra.island.is/oauth/token ',
              oAuthUserInfoUrl: 'http://innskra.island.is/userinfo',
              openIdConfiguration: 'http://innskra.island.is/openid',
              jsonWebKeySet: 'http://innskra.island.is/web-key',
            },
            applicationUrls: {
              callbackUrls: [],
              logoutUrls: [],
              cors: [],
            },
            lifeTime: {
              absoluteLifeTime: 2592000,
              inactivityExpiration: false,
              inactivityLifeTime: 1296000,
            },
          },
        ],
      },
    ],
    totalCount: 2,
    pageInfo: {
      hasNextPage: false,
    },
  }
}
