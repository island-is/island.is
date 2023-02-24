import { Injectable } from '@nestjs/common'

import { Environment } from '../models/environment'

@Injectable()
export class TenantsService {
  getTenants() {
    return {
      data: [
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
              applicationCount: 2,
              apiCount: 1,
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
              applicationCount: 2,
              apiCount: 1,
            },
            {
              name: '@admin.island.is',
              environment: Environment.Dev,
              displayName: [
                {
                  locale: 'is',
                  value: 'Ísland.is stjórnborð',
                },
              ],
              applicationCount: 4,
              apiCount: 1,
            },
          ],
          defaultEnvironment: {
            name: '@admin.island.is',
            environment: Environment.Production,
            displayName: [
              {
                locale: 'is',
                value: 'Ísland.is stjórnborð',
              },
            ],
            applicationCount: 4,
            apiCount: 1,
          },
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
              applicationCount: 3,
              apiCount: 2,
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
              applicationCount: 4,
              apiCount: 3,
            },
            {
              name: '@island.is',
              environment: Environment.Dev,
              displayName: [
                {
                  locale: 'is',
                  value: 'Ísland.is mínar síður',
                },
              ],
              applicationCount: 5,
              apiCount: 4,
            },
          ],
          defaultEnvironment: {
            name: '@island.is',
            environment: Environment.Production,
            displayName: [
              {
                locale: 'is',
                value: 'Ísland.is mínar síður',
              },
            ],
            applicationCount: 5,
            apiCount: 4,
          },
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
              applicationCount: 2,
              apiCount: 2,
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
              applicationCount: 4,
              apiCount: 3,
            },
          ],
          defaultEnvironment: {
            name: '@reykjavik.is',
            environment: Environment.Production,
            displayName: [
              {
                locale: 'is',
                value: 'Reykjavík mínar síður',
              },
            ],
            applicationCount: 4,
            apiCount: 3,
          },
        },
      ],
      totalCount: 3,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }
}
