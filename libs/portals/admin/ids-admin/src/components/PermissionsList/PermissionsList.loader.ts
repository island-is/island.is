import type { WrappedLoaderFn } from '@island.is/portals/core'

export const permissionsListLoader: WrappedLoaderFn = () => {
  return async ({ params }): Promise<string[]> => {
    if (!params['tenant']) {
      throw new Error('Tenant not found')
    }

    console.log(params['tenant'])

    return []
  }
}
