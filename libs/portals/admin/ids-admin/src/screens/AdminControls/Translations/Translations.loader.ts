import type { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetTranslationsDocument,
  GetTranslationsQuery,
  GetTranslationLanguagesDocument,
  GetTranslationLanguagesQuery,
  GetTranslationConfiguredEnvironmentsDocument,
  GetTranslationConfiguredEnvironmentsQuery,
} from './Translations.generated'

export interface TranslationsLoaderData {
  translations: GetTranslationsQuery['authAdminTranslations']
  languages: GetTranslationLanguagesQuery['authAdminTranslationLanguages']
  configuredEnvironments: GetTranslationConfiguredEnvironmentsQuery['authAdminTranslationConfiguredEnvironments']
}

export const translationsLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ request }): Promise<TranslationsLoaderData> => {
    const url = new URL(request.url)
    const rawPage = parseInt(url.searchParams.get('page') ?? '1', 10)
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage
    const search = url.searchParams.get('search') ?? ''

    const [translationsResult, languagesResult, envsResult] = await Promise.all(
      [
        client.query<GetTranslationsQuery>({
          query: GetTranslationsDocument,
          fetchPolicy: 'network-only',
          variables: {
            input: {
              searchString: search,
              page,
              count: 20,
            },
          },
        }),
        client.query<GetTranslationLanguagesQuery>({
          query: GetTranslationLanguagesDocument,
          fetchPolicy: 'network-only',
        }),
        client.query<GetTranslationConfiguredEnvironmentsQuery>({
          query: GetTranslationConfiguredEnvironmentsDocument,
          fetchPolicy: 'network-only',
        }),
      ],
    )

    if (translationsResult.error) {
      throw translationsResult.error
    }

    if (languagesResult.error) {
      console.error(
        'Failed to fetch translation languages',
        languagesResult.error,
      )
    }

    if (envsResult.error) {
      console.error('Failed to fetch configured environments', envsResult.error)
    }

    return {
      translations: translationsResult.data?.authAdminTranslations ?? {
        rows: [],
        totalCount: 0,
      },
      languages: languagesResult.data?.authAdminTranslationLanguages ?? [],
      configuredEnvironments:
        envsResult.data?.authAdminTranslationConfiguredEnvironments ?? [],
    }
  }
}
