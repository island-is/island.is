import { Injectable } from '@nestjs/common'

import { Environment } from '@island.is/shared/types'
import { CreateApplicationInput } from './dto/createApplication.input'
import { Application } from './models/application.model'
import { ApplicationEnvironment } from './models/applications-environment.model'
import { TranslatedValue } from '../models/translated-value.model'
import { ApplicationType } from '../models/applicationType'

@Injectable()
export class ApplicationsService {
  getApplications(tenantId: string) {
    const resp = getMockData()
    resp.data = resp.data.filter((x) => {
      return x.tenantId === tenantId
    })
    return resp
  }

  createClient(input: CreateApplicationInput) {
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
      applicationEnv.callbackUrls = []

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
            callbackUrls: ['https://island.is'],
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
            callbackUrls: ['https://island.is'],
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
                value: 'Auth Admin Web',
              },
            ],
            callbackUrls: ['https://island.is'],
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
            callbackUrls: ['https://island.is'],
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
            callbackUrls: ['https://island.is'],
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
            callbackUrls: ['https://island.is'],
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
