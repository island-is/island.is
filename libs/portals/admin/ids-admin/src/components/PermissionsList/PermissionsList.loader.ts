import type { WrappedLoaderFn } from '@island.is/portals/core'

export const permissionsListLoader: WrappedLoaderFn = () => {
  return async (): Promise<string[]> => {
    return []
  }
}
