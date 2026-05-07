import type { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetTranslationsDocument,
  GetTranslationsQuery,
  GetTranslationLanguagesDocument,
  GetTranslationLanguagesQuery,
  GetTranslationConfiguredEnvironmentsDocument,
  GetTranslationConfiguredEnvironmentsQuery,
} from './Translations.generated'
import { PAGE_SIZE } from './Translations.utils'

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

    const [translationsSettled, languagesSettled, envsSettled] =
      await Promise.allSettled([
        client.query<GetTranslationsQuery>({
          query: GetTranslationsDocument,
          fetchPolicy: 'network-only',
          variables: {
            input: {
              searchString: search,
              page,
              count: PAGE_SIZE,
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
      ])

    // Translations is the load-bearing query — propagate its failure.
    if (translationsSettled.status === 'rejected') {
      throw translationsSettled.reason
    }
    if (translationsSettled.value.error) {
      throw translationsSettled.value.error
    }

    // Languages and configured environments are nice-to-have UI data; log and
    // fall back so a transient failure on either doesn't take down the page.
    if (languagesSettled.status === 'rejected') {
      console.error(
        'Failed to fetch translation languages',
        languagesSettled.reason,
      )
    } else if (languagesSettled.value.error) {
      console.error(
        'Failed to fetch translation languages',
        languagesSettled.value.error,
      )
    }

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
      translations: translationsSettled.value.data?.authAdminTranslations ?? {
        rows: [],
        totalCount: 0,
      },
      languages:
        (languagesSettled.status === 'fulfilled' &&
          languagesSettled.value.data?.authAdminTranslationLanguages) ||
        [],
      configuredEnvironments:
        (envsSettled.status === 'fulfilled' &&
          envsSettled.value.data?.authAdminTranslationConfiguredEnvironments) ||
        [],
    }
  }
}
