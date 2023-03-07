import { Injectable } from '@nestjs/common'

import { Environment } from '../models/environment'

const MOCKED_TENANTS = [
  {
    id: '@admin.island.is',
    environments: [
      {
        name: '@admin.island.is',
        environment: Environment.Production,
        displayName: [
          {
            locale: 'is',
            value: 'Ísland.is stjórnborð',
          },
        ],
      },
      {
        name: '@admin.island.is',
        environment: Environment.Staging,
        displayName: [
          {
            locale: 'is',
            value: 'Ísland.is stjórnborð',
          },
        ],
      },
      {
        name: '@admin.island.is',
        environment: Environment.Development,
        displayName: [
          {
            locale: 'is',
            value: 'Ísland.is stjórnborð',
          },
        ],
      },
    ],
  },
  {
    id: '@island.is',
    environments: [
      {
        name: '@island.is',
        environment: Environment.Production,
        displayName: [
          {
            locale: 'is',
            value: 'Ísland.is mínar síður',
          },
        ],
      },
      {
        name: '@island.is',
        environment: Environment.Staging,
        displayName: [
          {
            locale: 'is',
            value: 'Ísland.is mínar síður',
          },
        ],
      },
      {
        name: '@island.is',
        environment: Environment.Development,
        displayName: [
          {
            locale: 'is',
            value: 'Ísland.is mínar síður',
          },
        ],
      },
    ],
  },
  {
    id: '@reykjavik.is',
    environments: [
      {
        name: '@reykjavik.is',
        environment: Environment.Production,
        displayName: [
          {
            locale: 'is',
            value: 'Reykjavík mínar síður',
          },
        ],
      },
      {
        name: '@reykjavik.is',
        environment: Environment.Staging,
        displayName: [
          {
            locale: 'is',
            value: 'Reykjavík mínar síður',
          },
        ],
      },
    ],
  },
]

@Injectable()
export class TenantsService {
  getTenant(id: string) {
    return MOCKED_TENANTS.find((tenant) => tenant.id === id)
  }

  getTenants() {
    return {
      data: MOCKED_TENANTS,
      totalCount: 3,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }
}
