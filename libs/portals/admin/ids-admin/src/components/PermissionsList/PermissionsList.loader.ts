import type { WrappedLoaderFn } from '@island.is/portals/core'

const mock = [
  {
    displayName: 'Stjórnborð Ísland.is',
    id: '@admin.island.is',
    environments: ['Production', 'Staging', 'Development'],
  },
  {
    displayName: 'Vegagerðin',
    id: '@admin.vegagerdin.is',
    environments: ['Production', 'Staging', 'Development'],
  },
]

export type MockData = typeof mock

export const permissionsListLoader: WrappedLoaderFn = () => {
  return async ({ params }): Promise<MockData> => {
    if (!params['tenant']) {
      throw new Error('Tenant not found')
    }

    return mock
  }
}
