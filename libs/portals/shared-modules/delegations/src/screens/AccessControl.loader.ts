import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  GetServicePortalPageDocument,
  GetServicePortalPageQuery,
} from './queries/ServicePortalPage.generated'

export type AccessControlLoaderResponse =
  GetServicePortalPageQuery['getServicePortalPage']

export const accessControlLoader =
  (slug: string): WrappedLoaderFn =>
  ({ client, userInfo }) =>
  async (): Promise<AccessControlLoaderResponse> => {
    try {
      const locale = userInfo.profile.locale || 'is'

      const res = await client.query<GetServicePortalPageQuery>({
        query: GetServicePortalPageDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            slug,
            lang: locale,
          },
        },
      })

      return res.data.getServicePortalPage
    } catch (e) {
      console.error('ServicePortalPage error:', e)
      // Return null if the page doesn't exist or there's an error
      // This allows the component to render without the data
      return null
    }
  }
