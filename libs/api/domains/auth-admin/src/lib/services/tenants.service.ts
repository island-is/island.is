import { Injectable } from '@nestjs/common'

import { TenantsPayload } from '../dto/tenants.payload'
import { Environment } from '../models/environment'

@Injectable()
export class TenantsService {
  getTenants(): TenantsPayload {
    return {
      data: [
        {
          id: '@admin.island.is',
          environments: [
            {
              id: '@admin.island.is',
              environment: Environment.Production,
              displayName: [
                {
                  locale: 'is',
                  value: 'Ísland.is stjórnborð',
                },
              ],
              applicationsCount: 2,
              apisCount: 1,
            },
            {
              id: '@admin.island.is',
              environment: Environment.Staging,
              displayName: [
                {
                  locale: 'is',
                  value: 'Ísland.is stjórnborð',
                },
              ],
              applicationsCount: 2,
              apisCount: 1,
            },
            {
              id: '@admin.island.is',
              environment: Environment.Dev,
              displayName: [
                {
                  locale: 'is',
                  value: 'Ísland.is stjórnborð',
                },
              ],
              applicationsCount: 2,
              apisCount: 1,
            },
          ],
        },
        {
          id: '@island.is',
          environments: [
            {
              id: '@island.is',
              environment: Environment.Production,
              displayName: [
                {
                  locale: 'is',
                  value: 'Ísland.is mínar síður',
                },
              ],
              applicationsCount: 3,
              apisCount: 2,
            },
            {
              id: '@island.is',
              environment: Environment.Staging,
              displayName: [
                {
                  locale: 'is',
                  value: 'Ísland.is mínar síður',
                },
              ],
              applicationsCount: 4,
              apisCount: 3,
            },
            {
              id: '@island.is',
              environment: Environment.Dev,
              displayName: [
                {
                  locale: 'is',
                  value: 'Ísland.is mínar síður',
                },
              ],
              applicationsCount: 5,
              apisCount: 4,
            },
          ],
        },
        {
          id: '@reykjavik.is',
          environments: [
            {
              id: '@reykjavik.is',
              environment: Environment.Production,
              displayName: [
                {
                  locale: 'is',
                  value: 'Reykjavík mínar síður',
                },
              ],
              applicationsCount: 2,
              apisCount: 2,
            },
            {
              id: '@reykjavik.is',
              environment: Environment.Staging,
              displayName: [
                {
                  locale: 'is',
                  value: 'Reykjavík mínar síður',
                },
              ],
              applicationsCount: 4,
              apisCount: 3,
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
