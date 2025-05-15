import { CollectionProp, EntryProps, KeyValueMap } from 'contentful-management'
import { CMAClient } from '@contentful/app-sdk'
import sindresorhusSlugify from '@sindresorhus/slugify'

import {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE,
  CUSTOM_SLUGIFY_REPLACEMENTS,
  DEFAULT_LOCALE,
  DEV_WEB_BASE_URL,
} from '../constants'

export const getContentfulEntries = async (
  cma: CMAClient,
  contentType: string,
  query?: Record<string, string>,
) => {
  const items: EntryProps<KeyValueMap>[] = []
  let response: CollectionProp<EntryProps<KeyValueMap>> | null = null

  let chunkSize = 1000

  while (
    chunkSize > 0 &&
    (response === null || items.length < response.total)
  ) {
    try {
      response = await cma.entry.getMany({
        environmentId: CONTENTFUL_ENVIRONMENT,
        spaceId: CONTENTFUL_SPACE,
        query: {
          content_type: contentType,
          limit: chunkSize,
          skip: items.length,
          ...query,
        },
      })
      for (const item of response.items) {
        items.push(item)
      }
    } catch (error: unknown) {
      if (
        ((error as { message?: string })?.message as string)
          ?.toLowerCase()
          ?.includes('response size too big')
      ) {
        chunkSize = Math.floor(chunkSize / 2)
      } else {
        return items
      }
    }
  }

  return items
}

export const parseContentfulErrorMessage = (error: unknown) => {
  let errorMessage = ''
  try {
    const errorObject = JSON.parse((error as { message: string })?.message)
      ?.details?.errors?.[0]
    errorMessage = `${errorObject?.details ?? ''}${
      errorObject?.value ? ' - value: ' + errorObject.value : ''
    }`
  } catch (_) {
    // Do nothing in case an error occurs during JSON.parse()
  }
  return errorMessage
}

export const slugifyDate = (value: string) => {
  if (!value) return ''
  try {
    const date = new Date(value)
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  } catch {
    return ''
  }
}

export const previewLinkHandler = {
  vacancy: (entry: EntryProps<KeyValueMap>) => {
    return `${DEV_WEB_BASE_URL}/starfatorg/c-${entry.sys.id}`
  },
  article: (entry: EntryProps<KeyValueMap>) => {
    return `${DEV_WEB_BASE_URL}/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
  subArticle: async (entry: EntryProps<KeyValueMap>, cma: CMAClient) => {
    const parentArticleId = entry.fields.parent?.[DEFAULT_LOCALE]?.sys?.id
    const parentArticle = await cma.entry.get({
      entryId: parentArticleId,
    })
    return `${DEV_WEB_BASE_URL}/${
      parentArticle?.fields?.slug[DEFAULT_LOCALE]
    }/${entry.fields.url[DEFAULT_LOCALE]?.split('/')?.pop() ?? ''}`
  },
  organizationPage: (entry: EntryProps<KeyValueMap>) => {
    return `${DEV_WEB_BASE_URL}/s/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
  projectPage: (entry: EntryProps<KeyValueMap>) => {
    return `${DEV_WEB_BASE_URL}/v/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
  organizationSubpage: async (
    entry: EntryProps<KeyValueMap>,
    cma: CMAClient,
  ) => {
    const organizationPageId =
      entry.fields.organizationPage?.[DEFAULT_LOCALE]?.sys?.id
    const [organizationPage, organizationParentSubpageResponse] =
      await Promise.all([
        cma.entry.get({
          entryId: organizationPageId,
        }),
        cma.entry.getMany({
          query: {
            content_type: 'organizationParentSubpage',
            include: 1,
            links_to_entry: entry.sys.id,
            'sys.archivedAt[exists]': false,
          },
        }),
      ])

    const orgPageSlug = organizationPage?.fields?.slug?.[DEFAULT_LOCALE]
    const slug = entry.fields.slug[DEFAULT_LOCALE]

    if (!organizationParentSubpageResponse?.items?.length) {
      return `${DEV_WEB_BASE_URL}/s/${orgPageSlug}/${slug}`
    }
    return `${DEV_WEB_BASE_URL}/s/${orgPageSlug}/${organizationParentSubpageResponse.items[0].fields.slug[DEFAULT_LOCALE]}/${slug}`
  },
  anchorPage: (entry: EntryProps<KeyValueMap>) => {
    const middlePart =
      entry.fields.pageType?.[DEFAULT_LOCALE] === 'Digital Iceland Service'
        ? 's/stafraent-island/thjonustur'
        : 'lifsvidburdir'

    return `${DEV_WEB_BASE_URL}/${middlePart}/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
  lifeEventPage: (entry: EntryProps<KeyValueMap>) => {
    return `${DEV_WEB_BASE_URL}/lifsvidburdir/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
  news: (entry: EntryProps<KeyValueMap>) => {
    return `${DEV_WEB_BASE_URL}/frett/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
  manual: (entry: EntryProps<KeyValueMap>) => {
    return `${DEV_WEB_BASE_URL}/handbaekur/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
  organizationParentSubpage: async (
    entry: EntryProps<KeyValueMap>,
    cma: CMAClient,
  ) => {
    const organizationPageId =
      entry.fields.organizationPage?.[DEFAULT_LOCALE]?.sys?.id
    const organizationPage = await cma.entry.get({
      entryId: organizationPageId,
      environmentId: CONTENTFUL_ENVIRONMENT,
      spaceId: CONTENTFUL_SPACE,
    })
    const orgPageSlug = organizationPage?.fields?.slug?.[DEFAULT_LOCALE]

    return `${DEV_WEB_BASE_URL}/s/${orgPageSlug}/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
}

export const slugify = (value: string) => {
  return sindresorhusSlugify(value, {
    customReplacements: CUSTOM_SLUGIFY_REPLACEMENTS,
  })
}
