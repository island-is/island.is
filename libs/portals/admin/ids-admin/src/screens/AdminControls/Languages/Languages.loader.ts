import type { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetLanguagesDocument,
  GetLanguagesQuery,
  GetLanguageConfiguredEnvironmentsDocument,
  GetLanguageConfiguredEnvironmentsQuery,
} from './Languages.generated'
import { PAGE_SIZE } from './Languages.utils'

export interface LanguagesLoaderData {
  languages: GetLanguagesQuery['authAdminLanguages']
  configuredEnvironments: GetLanguageConfiguredEnvironmentsQuery['authAdminLanguageConfiguredEnvironments']
}

export const languagesLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ request }): Promise<LanguagesLoaderData> => {
    const url = new URL(request.url)
    const rawPage = parseInt(url.searchParams.get('page') ?? '1', 10)
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage
    const search = url.searchParams.get('search') ?? ''

    const [languagesSettled, envsSettled] = await Promise.allSettled([
      client.query<GetLanguagesQuery>({
        query: GetLanguagesDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            searchString: search,
            page,
            count: PAGE_SIZE,
          },
        },
      }),
      client.query<GetLanguageConfiguredEnvironmentsQuery>({
        query: GetLanguageConfiguredEnvironmentsDocument,
        fetchPolicy: 'network-only',
      }),
    ])

    // Languages is the load-bearing query — propagate its failure.
    if (languagesSettled.status === 'rejected') {
      throw languagesSettled.reason
    }
    if (languagesSettled.value.error) {
      throw languagesSettled.value.error
    }

    // Configured environments is nice-to-have; log and fall back so a transient
    // failure doesn't take down the page.
    if (envsSettled.status === 'rejected') {
      console.error(
        'Failed to fetch configured environments',
        envsSettled.reason,
      )
    } else if (envsSettled.value.error) {
      console.error(
        'Failed to fetch configured environments',
        envsSettled.value.error,
      )
    }

    return {
      languages: languagesSettled.value.data?.authAdminLanguages ?? {
        rows: [],
        totalCount: 0,
      },
      configuredEnvironments:
        (envsSettled.status === 'fulfilled' &&
          envsSettled.value.data?.authAdminLanguageConfiguredEnvironments) ||
        [],
    }
  }
}
