import { Injectable } from '@nestjs/common'

import { Environment } from '../models/environment'

@Injectable()
export class ApplicationsService {
  getApplications(tenantId: string) {
    const resp = getMockData()
    resp.data = resp.data.filter((x) => {
      return x.tenantId === tenantId
    })
    return resp
  }
}

const getMockData = () => {
  return {
    data: [
      {
        applicationId: '@island.is/web',
        applicationType: 'Web Application',
        tenantId: '@island.is',
        environments: [
          {
            name: '@island.is/web',
            environment: Environment.Dev,
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
        applicationType: 'Web Application',
        tenantId: '@admin.island.is',
        environments: [
          {
            name: '@island.is/auth-admin-web',
            environment: Environment.Dev,
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
        applicationType: 'Web Application',
        tenantId: '@admin.island.is',
        environments: [
          {
            name: '@island.is/auth',
            environment: Environment.Dev,
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
