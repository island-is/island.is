import groupBy from 'lodash/groupBy'
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

interface ChangelogItem {
  dateOfChange: string
  textualDescription: string
  chapterTitle: string
  manualSlug: string
  chapterSlug: string
}

type Changelog = {
  year: number
  dates: { date: string; items: ChangelogItem[] }[]
}[]

export const extractChangelogFromManual = (manual: ManualType) => {
  const yearMap = new Map<number, ChangelogItem[]>()

  for (const chapter of manual?.chapters ?? []) {
    for (const changelogItem of chapter?.changelog?.items ?? []) {
      if (changelogItem?.dateOfChange && changelogItem?.textualDescription) {
        const year = new Date(changelogItem.dateOfChange).getFullYear()
        const items = yearMap.get(year)

        const parsedItem: ChangelogItem = {
          manualSlug: manual?.slug as string,
          chapterSlug: chapter.slug,
          chapterTitle: chapter.title,
          dateOfChange: changelogItem.dateOfChange,
          textualDescription: changelogItem.textualDescription,
        }

        if (!items) {
          yearMap.set(year, [parsedItem])
        } else {
          items.push(parsedItem)
        }
      }
    }
  }

  const years = Array.from(yearMap.keys())
  years.sort().reverse()

  const changelog: Changelog = []
  for (const year of years) {
    const items = yearMap.get(year)
    if (items) {
      const itemsGroupedByDate = groupBy(items, 'dateOfChange')

      const dates: Changelog[number]['dates'] = []

      const descendingOrderedDates = Object.keys(itemsGroupedByDate)
        .sort()
        .reverse()

      for (const date of descendingOrderedDates) {
        dates.push({
          date,
          items: itemsGroupedByDate[date],
        })
      }

      changelog.push({
        year,
        dates,
      })
    }
  }

  return changelog
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
