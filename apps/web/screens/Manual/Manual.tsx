import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Accordion,
  AccordionItem,
  AsyncSearchInput,
  Box,
  GridContainer,
  Inline,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  GetSingleManualQuery,
  GetSingleManualQueryVariables,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import { GET_NAMESPACE_QUERY } from '../queries'
import { GET_SINGLE_MANUAL_QUERY } from '../queries/Manual'

type ManualType = GetSingleManualQuery['getSingleManual']

interface ManualProps {
  manual: ManualType
  manualChapter: ReturnType<typeof extractChapterFromManual>
  namespace: Record<string, string>
}

const extractChapterFromManual = (manual: ManualType, chapterSlug: string) => {
  return manual?.chapters.find((c) => c?.slug === chapterSlug)
}

const extractLastUpdatedDateFromManual = (manual: ManualType) => {
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

// TODO: Make 'EN' button work

const Manual: Screen<ManualProps> = ({ manual, manualChapter, namespace }) => {
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()
  const [searchValue, setSearchValue] = useState('')
  const [searchInputHasFocus, setSearchInputHasFocus] = useState(false)
  const { format } = useDateUtils()
  const router = useRouter()

  const handleSearch = () => {
    if (!searchValue) {
      return
    }
    // TODO: redirect user to search page with manual filter pre-selected
    router.push(linkResolver('search').href + '?q=' + searchValue)
  }

  // TODO: test this
  const lastUpdatedDate = useMemo(() => {
    const date = extractLastUpdatedDateFromManual(manual)
    return date ? format(date, 'dd.mm.yyyy') : ''
  }, [format, manual])

  // TODO: separate pages so we can easily import a single thing in /pages folder to determine
  // If we want to display a manual chapter, changelog or simply the frontpage (manual chapter and changelog are very similar)

  // TODO: query chapter description as well
  return (
    <GridContainer>
      <Box paddingBottom={6}>
        <Stack space={3}>
          <Stack space={3}>
            <Text variant="h1" as="h1">
              {manual?.title}
            </Text>
            <Stack space={1}>
              {manual?.organization?.slug && manual?.organization?.slug && (
                <Inline space={1}>
                  <Text>
                    {n('manualPageOrganizationPrefix', 'Þjónustuaðili')}:
                  </Text>
                  <LinkV2
                    color="blue400"
                    underlineVisibility="always"
                    underline="small"
                    href={
                      linkResolver('organizationpage', [
                        manual.organization.slug,
                      ]).href
                    }
                  >
                    {manual.organization.title}
                  </LinkV2>
                </Inline>
              )}
              {lastUpdatedDate && (
                <Inline space={1}>
                  <Text>{n('manualPageLastUpdated', 'Síðast uppfært')}:</Text>
                  <Text>{lastUpdatedDate} - </Text>
                  <LinkV2
                    href={
                      linkResolver('manualchangelog', [manual?.slug as string])
                        .href
                    }
                  >
                    {n('manualPageSeeChangelogText', 'sjá breytingasögu')}
                  </LinkV2>
                </Inline>
              )}
            </Stack>

            <AsyncSearchInput
              buttonProps={{
                onClick: () => handleSearch(),
                onFocus: () => setSearchInputHasFocus(true),
                onBlur: () => setSearchInputHasFocus(false),
              }}
              inputProps={{
                onFocus: () => setSearchInputHasFocus(true),
                onBlur: () => setSearchInputHasFocus(false),
                name: 'manual-page-search-input',
                inputSize: 'medium',
                placeholder: n(
                  'manualPageSearchInputPlaceholder',
                  'Leitaðu í handbókinni',
                ),
                colored: true,
                onChange: (ev) => setSearchValue(ev.target.value),
                value: searchValue,
                onKeyDown: (ev) => {
                  if (ev.key === 'Enter') {
                    handleSearch()
                  }
                },
              }}
              hasFocus={searchInputHasFocus}
            />
          </Stack>

          <Box>
            <Text variant="eyebrow">
              {n('manualPageAboutEyebrowText', 'Um handbókina')}
            </Text>
            {webRichText((manual?.description ?? []) as SliceType[])}
          </Box>

          <Stack space={3}>
            {!manualChapter &&
              manual?.chapters.map((chapter) => (
                <Box key={chapter.id}>
                  <LinkV2
                    underlineVisibility="always"
                    underline="small"
                    color="blue400"
                    href={
                      linkResolver('manualchapter', [manual.slug, chapter.slug])
                        .href
                    }
                  >
                    {chapter.title}
                  </LinkV2>
                </Box>
              ))}
            {manualChapter && (
              <Accordion>
                {manualChapter.chapterItems.map((item) => (
                  <AccordionItem key={item.id} id={item.id} label={item.title}>
                    {webRichText(
                      item.content as SliceType[],
                      undefined,
                      activeLocale,
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </Stack>
        </Stack>
      </Box>
    </GridContainer>
  )
}

Manual.getProps = async ({ apolloClient, locale, query }) => {
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

export default withMainLayout(Manual)
