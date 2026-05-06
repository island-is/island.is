import type { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetLanguagesDocument,
  GetLanguagesQuery,
  GetLanguageConfiguredEnvironmentsDocument,
  GetLanguageConfiguredEnvironmentsQuery,
} from './Languages.generated'

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

    const [languagesResult, envsResult] = await Promise.all([
      client.query<GetLanguagesQuery>({
        query: GetLanguagesDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            searchString: search,
            page,
            count: 20,
          },
        },
      }),
      client.query<GetLanguageConfiguredEnvironmentsQuery>({
        query: GetLanguageConfiguredEnvironmentsDocument,
        fetchPolicy: 'network-only',
      }),
    ])

    if (languagesResult.error) {
      throw languagesResult.error
    }

    if (envsResult.error) {
      console.error('Failed to fetch configured environments', envsResult.error)
    }

    return {
      languages: languagesResult.data?.authAdminLanguages ?? {
        rows: [],
        totalCount: 0,
      },
      configuredEnvironments:
        envsResult.data?.authAdminLanguageConfiguredEnvironments ?? [],
    }
  }
}
