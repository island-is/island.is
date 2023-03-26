import { Injectable } from '@nestjs/common'

import { Environment } from '@island.is/shared/types'
import { CreateClientsInput } from './dto/createClientsInput'
import { ApplicationType } from '../models/applicationType'
import { Auth } from '@island.is/auth-nest-tools'
import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import {
  AdminCreateClientDto,
  AdminCreateClientDtoClientTypeEnum,
  MeClientsControllerCreateRequest,
} from '@island.is/clients/auth/admin-api'
import { CreateApplicationResponseDto } from './dto/create-application-response'

@Injectable()
export class ApplicationsService extends MultiEnvironmentService {
  getApplications(tenantId: string) {
    const resp = getMockData()
    resp.data = resp.data.filter((x) => {
      return x.tenantId === tenantId
    })
    return resp
  }

  getApplicationById(tenantId: string, applicationId: string) {
    const resp = getMockData()
    resp.data = resp.data.filter((x) => {
      return x.tenantId === tenantId && x.applicationId === applicationId
    })

    return resp.data[0]
  }

  async createApplication(
    input: CreateClientsInput,
    user: Auth,
  ): Promise<CreateApplicationResponseDto[]> {
    const applicationRequest: MeClientsControllerCreateRequest = {
      tenantId: input.tenantId,
      adminCreateClientDto: {
        clientId: input.applicationId,
        clientType: (input.applicationType as string) as AdminCreateClientDtoClientTypeEnum,
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
        applicationType: ApplicationType.Web,
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
        applicationType: ApplicationType.Web,
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
        applicationType: ApplicationType.Web,
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
