import { Query } from '@island.is/api/schema'
import { GET_TRANSLATIONS } from '@island.is/localization'
import type { WrappedLoaderFn } from '@island.is/portals/core'

export const translationLoader: WrappedLoaderFn =
  ({ client, userInfo }) =>
  async () => {
    try {
      const { data } = await client.query<Query>({
        query: GET_TRANSLATIONS,
        variables: {
          input: {
            namespaces: ['sp.vehicles'],
            lang: userInfo.profile.locale || 'is',
          },
        },
      })
      return data?.getTranslations
    } catch {
      return null
    }
  }
