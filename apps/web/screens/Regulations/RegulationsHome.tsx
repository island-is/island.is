import {
  Year,
  getParams,
  prettyName,
  isPlural,
  interpolate,
  LawChapterTree,
  MinistryList,
} from '@island.is/regulations'
import { RegulationSearchResults } from '@island.is/regulations/web'
import { RegulationHomeTexts } from '../../components/Regulations/RegulationTexts.types'

import React, { useEffect, useState, useRef } from 'react'
import omit from 'lodash/omit'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import { SubpageDetailsContent } from '@island.is/web/components'
import { SubpageLayout } from '@island.is/web/screens/Layouts/Layouts'
import {
  Box,
  Breadcrumbs,
  Button,
  CategoryCard,
  GridColumn,
  GridColumnProps,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationsSearchSection } from '../../components/Regulations/RegulationsSearchSection'
import {
  RegulationSearchFilters,
  useRegulationLinkResolver,
} from '../../components/Regulations/regulationUtils'
import { getUiTexts } from '../../components/Regulations/getUiTexts'
import {
  GetRegulationsSearchQuery,
  QueryGetRegulationsSearchArgs,
  GetRegulationsQuery,
  QueryGetRegulationsArgs,
  GetRegulationsYearsQuery,
  GetRegulationsMinistriesQuery,
  GetRegulationsLawChaptersQuery,
  QueryGetRegulationsLawChaptersArgs,
  GetSubpageHeaderQuery,
  QueryGetSubpageHeaderArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_REGULATIONS_SEARCH_QUERY,
  GET_REGULATIONS_LAWCHAPTERS_QUERY,
  GET_REGULATIONS_MINISTRIES_QUERY,
  GET_REGULATIONS_QUERY,
  GET_REGULATIONS_YEARS_QUERY,
  GET_SUBPAGE_HEADER_QUERY,
} from '../queries'
import { RegulationsHomeIntro } from '../../components/Regulations/RegulationsHomeIntro'

// ---------------------------------------------------------------------------

export type RegulationsHomeProps = {
  regulations: RegulationSearchResults
  texts: RegulationHomeTexts
  introText: GetSubpageHeaderQuery['getSubpageHeader']
  searchQuery: RegulationSearchFilters
  years: ReadonlyArray<number>
  ministries: MinistryList
  lawChapters: LawChapterTree
  doSearch: boolean
}

const RegulationsHome: Screen<RegulationsHomeProps> = (props) => {
  const txt = useNamespace(props.texts)
  const anchor = useRef<HTMLDivElement>(null)
  const { linkResolver, linkToRegulation } = useRegulationLinkResolver()
  const regulations = props.regulations
  const totalItems = regulations.totalItems || 0
  const stepSize = regulations.perPage || 18
  const totalPages = regulations.totalPages || 1
  const [currentPage, setCurrentPage] = useState(regulations.page || 1)

  useEffect(() => {
    setCurrentPage(regulations.page || 1)
  }, [totalItems])

  const breadCrumbs = (
    <Box display={['none', 'none', 'block']}>
      {/* Show when NOT a device */}
      <Breadcrumbs
        items={[
          { title: 'Ísland.is', href: linkResolver('homepage').href },
          { title: 'Reglugerðir', href: linkResolver('regulationshome').href },
        ]}
      />
    </Box>
  )

  const resultTitleOffsets: GridColumnProps =
    totalItems === 0
      ? {
          span: ['1/1', '1/1', '1/1', '10/12'],
          offset: ['0', '0', '0', '1/12'],
          paddingTop: [2, 2, 4],
          paddingBottom: [4, 4, 8],
        }
      : {}

  const resultItems = props.regulations?.data || []
  const firstResultOrd = (currentPage - 1) * stepSize + 1
  const lastResultOrd = firstResultOrd - 1 + resultItems.length
  const hasPaging = totalItems > stepSize

  return (
    <SubpageLayout
      main={
        <>
          <RegulationsHomeIntro
            document={props.introText}
            breadCrumbs={breadCrumbs}
            getText={txt}
          />
          <RegulationsSearchSection
            searchFilters={props.searchQuery}
            lawChapters={props.lawChapters}
            ministries={props.ministries}
            years={props.years}
            texts={props.texts}
            page={currentPage}
            anchorRef={anchor}
          />
        </>
      }
      details={
        <>
          <div ref={anchor}></div>
          <SubpageDetailsContent
            header=""
            content={
              <GridContainer>
                <GridRow>
                  <GridColumn span="1/1" {...resultTitleOffsets}>
                    {!props.doSearch ? (
                      <Text as="h2" variant="h3">
                        {txt('homeNewestRegulations', 'Nýjustu reglugerðirnar')}
                      </Text>
                    ) : totalItems === 0 ? (
                      <p>
                        <strong>{txt('searchResultCountZero')}</strong>
                      </p>
                    ) : (
                      <Text as="h2">
                        {interpolate(
                          txt(
                            isPlural(totalItems)
                              ? 'searchResultCountPlural'
                              : 'searchResultCountSingular',
                          ),
                          { count: totalItems.toLocaleString('is') },
                        )}
                        {hasPaging &&
                          `, birti ${firstResultOrd} – ${lastResultOrd}`}
                      </Text>
                    )}
                  </GridColumn>
                </GridRow>

                <GridRow>
                  {resultItems.length > 0 &&
                    resultItems.map((reg) => (
                      <GridColumn
                        key={reg.name}
                        span={['1/1', '1/2', '1/2', '1/3']}
                        paddingTop={3}
                        paddingBottom={4}
                      >
                        <CategoryCard
                          href={linkToRegulation(reg.name)}
                          heading={prettyName(reg.name)}
                          text={reg.title}
                          tags={
                            reg.ministry
                              ? [
                                  {
                                    label:
                                      typeof reg.ministry === 'string'
                                        ? reg.ministry
                                        : reg.ministry.name,
                                    disabled: true,
                                  },
                                ]
                              : undefined
                          }
                        />
                      </GridColumn>
                    ))}
                </GridRow>
                {hasPaging && (
                  <Box marginTop={3}>
                    <Box marginTop={0} marginBottom={2} textAlign="center">
                      Síða {currentPage} af {totalPages}
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="center"
                      marginTop={3}
                      textAlign="center"
                    >
                      {currentPage > 1 && (
                        <Button onClick={() => setCurrentPage(currentPage - 1)}>
                          {txt('homePrevPage', 'Fyrri síða')}
                        </Button>
                      )}
                      &nbsp;&nbsp;
                      {currentPage < totalPages && (
                        <Button onClick={() => setCurrentPage(currentPage + 1)}>
                          {txt('homeNextPage', 'Næsta síða')}
                        </Button>
                      )}
                    </Box>
                  </Box>
                )}
              </GridContainer>
            }
          />
        </>
      }
    />
  )
}

/** Asserts that string is a number between 1900 and 2150
 *
 * Guards against "Infinity" and unreasonably sized numbers
 */
const assertReasonableYear = (maybeYear?: string): Year | undefined =>
  maybeYear && /^\d{4}$/.test(maybeYear)
    ? (Math.max(1900, Math.min(2150, Number(maybeYear))) as Year)
    : undefined

RegulationsHome.getProps = async (ctx) => {
  const { apolloClient, locale, query } = ctx
  const searchQuery = getParams(query, [
    'q',
    'rn',
    'year',
    'yearTo',
    'ch',
    'iA',
    'iR',
    'page',
  ])
  const doSearch = Object.values(omit(searchQuery, ['page'])).some(
    (value) => !!value,
  )

  const [texts, introText, regulations, years, ministries, lawChapters] =
    await Promise.all([
      await getUiTexts<RegulationHomeTexts>(
        apolloClient,
        locale,
        'Regulations_Home',
      ),

      apolloClient
        .query<GetSubpageHeaderQuery, QueryGetSubpageHeaderArgs>({
          query: GET_SUBPAGE_HEADER_QUERY,
          variables: {
            input: { id: 'regulations-intro', lang: locale },
          },
        })
        .then((res) => res.data?.getSubpageHeader),

      doSearch
        ? apolloClient
            .query<GetRegulationsSearchQuery, QueryGetRegulationsSearchArgs>({
              query: GET_REGULATIONS_SEARCH_QUERY,
              variables: {
                input: {
                  q: searchQuery.q,
                  rn: searchQuery.rn,
                  year: assertReasonableYear(searchQuery.year),
                  yearTo: assertReasonableYear(searchQuery.yearTo),
                  ch: searchQuery.ch,
                  iA: searchQuery.iA === 'true',
                  iR: searchQuery.iR === 'true',
                  page: searchQuery.page ? parseInt(searchQuery.page) : 1,
                },
              },
            })
            .then(
              (res) =>
                res.data?.getRegulationsSearch as RegulationSearchResults,
            )
        : apolloClient
            .query<GetRegulationsQuery, QueryGetRegulationsArgs>({
              query: GET_REGULATIONS_QUERY,
              variables: {
                input: {
                  type: 'newest',
                  page: searchQuery.page ? parseInt(searchQuery.page) : 1,
                },
              },
            })
            .then((res) => res.data?.getRegulations as RegulationSearchResults),

      apolloClient
        .query<GetRegulationsYearsQuery>({
          query: GET_REGULATIONS_YEARS_QUERY,
        })
        .then((res) => res.data?.getRegulationsYears as Array<number>),

      apolloClient
        .query<GetRegulationsMinistriesQuery>({
          query: GET_REGULATIONS_MINISTRIES_QUERY,
          variables: {
            input: {
              slugs: undefined,
            },
          },
        })
        .then((res) => res.data?.getRegulationsMinistries as MinistryList),

      apolloClient
        .query<
          GetRegulationsLawChaptersQuery,
          QueryGetRegulationsLawChaptersArgs
        >({
          query: GET_REGULATIONS_LAWCHAPTERS_QUERY,
          variables: {
            input: {
              tree: true,
            },
          },
        })
        .then((res) => res.data?.getRegulationsLawChapters as LawChapterTree),
    ])

  return {
    regulations,
    texts,
    introText,
    searchQuery,
    years,
    ministries,
    lawChapters,
    doSearch,
  }
}

export default withMainLayout(RegulationsHome)
