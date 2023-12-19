import type { WrappedLoaderFn } from '@island.is/portals/core'

export type RestrictionsLoaderResult = unknown

export const restrictionsLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<RestrictionsLoaderResult> => {
    return Promise.resolve({})
  }
}
