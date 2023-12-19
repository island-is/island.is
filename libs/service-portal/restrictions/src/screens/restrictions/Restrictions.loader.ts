import type { WrappedLoaderFn } from '@island.is/portals/core'

export type RestrictionsLoaderResult = {
  // Primary key
  nationalId: string // To allow user to query and remove this with other authentication methods

  // Unique column
  phoneNumber: string

  disabledUntil: Date

  // Standard PG fields
  created: Date
  modified: Date
}

export const restrictionsLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<RestrictionsLoaderResult> => {
    return Promise.resolve({
      nationalId: '1234567890',
      phoneNumber: '1234567',
      disabledUntil: new Date('2022-01-01'),
      created: new Date(),
      modified: new Date(),
    })
  }
}
