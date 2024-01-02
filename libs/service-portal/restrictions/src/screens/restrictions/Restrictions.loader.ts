import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  GetLoginRestrictionDocument,
  GetLoginRestrictionQuery,
} from './Restrictions.generated'

export type RestrictionsLoaderResponse =
  GetLoginRestrictionQuery['authLoginRestriction']

export const restrictionsLoader: WrappedLoaderFn =
  ({ client }) =>
  async (): Promise<RestrictionsLoaderResponse> => {
    try {
      const res = await client.query<GetLoginRestrictionQuery>({
        query: GetLoginRestrictionDocument,
        fetchPolicy: 'network-only',
      })

      return res.data.authLoginRestriction
    } catch (e) {
      throw new Error(e)
    }
  }
