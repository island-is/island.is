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
              environment: Environment.Dev,
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
              environment: Environment.Dev,
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
      ],
      totalCount: 3,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }
}
