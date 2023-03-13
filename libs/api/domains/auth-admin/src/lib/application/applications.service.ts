import { Injectable } from '@nestjs/common'

import { Environment } from '@island.is/shared/types'
import { CreateApplicationInput } from './dto/createApplication.input'
import { Application } from './models/application.model'
import { ApplicationEnvironment } from './models/applications-environment.model'
import { TranslatedValue } from '../models/translated-value.model'
import { ApplicationType } from '../models/applicationType'

@Injectable()
export class ApplicationsService {
  getApplications(tenantId: string, applicationId?: string) {
    const resp = getMockData()
    resp.data = resp.data.filter((x) => {
      return x.tenantId === tenantId
    })

    if (applicationId) {
      resp.data = resp.data.filter((x) => {
        console.log(x.applicationId, applicationId)
        return x.applicationId === applicationId
      })
    }
    return resp
  }

  createApplication(input: CreateApplicationInput) {
    const displayName = new TranslatedValue()
    displayName.locale = 'is'
    displayName.value = input.displayName

    const application = new Application()
    application.applicationId = input.applicationId
    application.applicationType = input.applicationType
    application.environments = input.environments.map((env) => {
      const applicationEnv = new ApplicationEnvironment()
      applicationEnv.name = input.applicationId
      applicationEnv.environment = env
      applicationEnv.displayName = [displayName]
      applicationEnv.ApplicationUrls.callbackUrls = []

      return applicationEnv
    })

    // TODO connect to REST service

    return application
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
