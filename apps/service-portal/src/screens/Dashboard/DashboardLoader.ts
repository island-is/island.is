import { Query } from '@island.is/api/schema'
import { GET_TRANSLATIONS } from '@island.is/localization'
import type { WrappedLoaderFn } from '@island.is/portals/core'

export const dashboardLoader: WrappedLoaderFn =
  ({ client, userInfo }) =>
  async () => {
    try {
      const { data } = await client.query<Query>({
        query: GET_TRANSLATIONS,
        variables: {
          input: {
            namespaces: ['service.portal', 'global', 'portals'],
            lang: userInfo.profile.locale || 'is',
          },
        },
      })
      return data?.getTranslations
    } catch {
      return null
    }
  }
