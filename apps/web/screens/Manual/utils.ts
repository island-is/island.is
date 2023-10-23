import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { Block } from '@contentful/rich-text-types'

import {
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  GetSingleManualQuery,
  GetSingleManualQueryVariables,
  Html,
} from '@island.is/web/graphql/schema'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { GET_NAMESPACE_QUERY } from '../queries'
import { GET_SINGLE_MANUAL_QUERY } from '../queries/Manual'

export type ManualType = GetSingleManualQuery['getSingleManual']
export type ManualScreen = Screen<ManualProps>

export interface ManualProps {
  manual: ManualType
  manualChapter: ReturnType<typeof extractChapterFromManual>
  namespace: Record<string, string>
}

export const extractChapterFromManual = (
  manual: ManualType,
  chapterSlug: string,
) => {
  return manual?.chapters.find((c) => c?.slug === chapterSlug)
}

export const extractLastUpdatedDateFromManual = (manual: ManualType) => {
  let lastUpdatedDate: Date | null = null
  for (const chapter of manual?.chapters ?? []) {
    for (const changelogItem of chapter?.changelog?.items ?? []) {
      const date = changelogItem?.dateOfChange
        ? new Date(changelogItem.dateOfChange)
        : null
      if (!date) {
        continue
      }
      if (!lastUpdatedDate || lastUpdatedDate < date) {
        lastUpdatedDate = date
      }
    }
  }
  return lastUpdatedDate
}

export const extractTextFromManualChapterDescription = (
  manualChapter: ManualProps['manualChapter'],
) => {
  const htmlSlices = manualChapter?.description?.filter(
    (chapter) => chapter?.__typename === 'Html',
  )

  if (!htmlSlices) return ''

  let text = ''

  for (const htmlSlice of htmlSlices) {
    const document = (htmlSlice as Html)?.document
    if (document) {
      text += documentToPlainTextString(document as Block)
    }
  }

  return text
}

export const getProps: ManualScreen['getProps'] = async ({
  apolloClient,
  locale,
  query,
}) => {
  const [manualResponse, namespaceResponse] = await Promise.all([
    apolloClient.query<GetSingleManualQuery, GetSingleManualQueryVariables>({
      query: GET_SINGLE_MANUAL_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale,
        },
      },
    }),
    apolloClient.query<GetNamespaceQuery, GetNamespaceQueryVariables>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          lang: locale,
          namespace: 'OrganizationPages',
        },
      },
    }),
  ])

  if (!manualResponse.data.getSingleManual) {
    throw new CustomNextError(404, `Manual page with slug: ${query.slug}`)
  }

  const manual = manualResponse.data.getSingleManual
  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  return {
    manual,
    manualChapter: extractChapterFromManual(
      manual,
      query.chapterSlug as string,
    ),
    namespace,
  }
}
