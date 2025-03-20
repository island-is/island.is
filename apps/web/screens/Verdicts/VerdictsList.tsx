import { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
} from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  Breadcrumbs,
  Button,
  GridContainer,
  Hidden,
  InfoCardGrid,
  Inline,
  Input,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { HeadWithSocialSharing, Webreader } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  type GetVerdictCaseCategoriesQuery,
  type GetVerdictCaseCategoriesQueryVariables,
  type GetVerdictCaseTypesQuery,
  type GetVerdictCaseTypesQueryVariables,
  type GetVerdictKeywordsQuery,
  type GetVerdictKeywordsQueryVariables,
  type GetVerdictsQuery,
  type GetVerdictsQueryVariables,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import SidebarLayout from '../Layouts/SidebarLayout'
import {
  GET_VERDICT_CASE_CATEGORIES_QUERY,
  GET_VERDICT_CASE_TYPES_QUERY,
  GET_VERDICT_KEYWORDS_QUERY,
  GET_VERDICTS_QUERY,
} from '../queries/Verdicts'
import { m } from './translations.strings'
import * as styles from './VerdictsList.css'

const ITEMS_PER_PAGE = 10
const DEBOUNCE_TIME_IN_MS = 1000

const ALL_COURTS_TAG = ''
const DEFAULT_DISTRICT_COURT_TAG = 'Héraðsdómur Reykjavíkur'

const SEARCH_TERM_QUERY_PARAM_KEY = 'q'
const COURT_QUERY_PARAM_KEY = 'court'

const extractCourtLevelFromState = (court: string | null | undefined) =>
  court || ALL_COURTS_TAG

interface VerdictsListProps {
  initialData: {
    visibleVerdicts: GetVerdictsQuery['webVerdicts']['items']
    invisibleVerdicts: GetVerdictsQuery['webVerdicts']['items']
    total: number
  }
}

const VerdictsList: CustomScreen<VerdictsListProps> = ({
  initialData,
  customPageData,
}) => {
  const [data, setData] = useState(initialData)
  const [page, setPage] = useState(1)
  const { format } = useDateUtils()
  const { formatMessage } = useIntl()
  const { width } = useWindowSize()
  const [searchTerm, setSearchTerm] = useQueryState(
    SEARCH_TERM_QUERY_PARAM_KEY,
    parseAsString
      .withOptions({
        clearOnDefault: true,
        shallow: false,
        throttleMs: DEBOUNCE_TIME_IN_MS,
      })
      .withDefault(''),
  )

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const [fetchVerdicts, { loading, error }] = useLazyQuery<
    GetVerdictsQuery,
    GetVerdictsQueryVariables
  >(GET_VERDICTS_QUERY)

  const [courtFilter, setCourtFilter] = useQueryState(
    COURT_QUERY_PARAM_KEY,
    parseAsString
      .withOptions({
        clearOnDefault: true,
        throttleMs: DEBOUNCE_TIME_IN_MS,
        shallow: false,
      })
      .withDefault(ALL_COURTS_TAG),
  )

  useEffect(() => {
    if (page <= 1) {
      return
    }

    fetchVerdicts({
      variables: {
        input: {
          page,
          searchTerm,
          courtLevel: extractCourtLevelFromState(courtFilter),
        },
      },
      onCompleted(response) {
        setData((prevData) => {
          const verdicts = response.webVerdicts.items
            .concat(prevData.invisibleVerdicts)
            // Remove all duplicate verdicts in case there were new verdicts published since last page load
            .filter(
              (verdict) =>
                !verdict.id ||
                !prevData.visibleVerdicts
                  .map(({ id }) => id)
                  .includes(verdict.id),
            )

          verdicts.sort((a, b) => {
            if (!a.verdictDate && !b.verdictDate) return 0
            if (!b.verdictDate) return -1
            if (!a.verdictDate) return 1
            return (
              new Date(b.verdictDate).getTime() -
              new Date(a.verdictDate).getTime()
            )
          })

          return {
            visibleVerdicts: prevData.visibleVerdicts.concat(
              verdicts.slice(0, ITEMS_PER_PAGE),
            ),
            invisibleVerdicts: verdicts.slice(ITEMS_PER_PAGE),
            total: initialData.total,
          }
        })
      },
    })
  }, [courtFilter, fetchVerdicts, initialData.total, page, searchTerm])

  const [isGridLayout, setIsGridLayout] = useState(false)
  const overrideGridLayoutSetting = width < theme.breakpoints.lg
  const heading = formatMessage(m.listPage.heading)

  const courtTags = useMemo(() => {
    return [
      {
        label: formatMessage(m.listPage.showDistrictCourts),
        value: DEFAULT_DISTRICT_COURT_TAG,
      },
      {
        label: formatMessage(m.listPage.showCourtOfAppeal),
        value: 'Landsréttur',
      },
      {
        label: formatMessage(m.listPage.showSupremeCourt),
        value: 'Hæstiréttur',
      },
    ]
  }, [formatMessage])
  const districtCourtTags = useMemo(() => {
    return [
      {
        label: 'Reykjavík',
        value: DEFAULT_DISTRICT_COURT_TAG,
      },
      {
        label: 'Vesturland',
        value: 'Héraðsdómur Vesturlands',
      },
      {
        label: 'Vestfirðir',
        value: 'Héraðsdómur Vestfjarða',
      },
      {
        label: 'Norðurland vestra',
        value: 'Héraðsdómur Norðurlands vestra',
      },
      {
        label: 'Norðurland eystra',
        value: 'Héraðsdómur Norðurlands eystra',
      },
      {
        label: 'Austurland',
        value: 'Héraðsdómur Austurlands',
      },
      {
        label: 'Suðurland',
        value: 'Héraðsdómur Suðurlands',
      },
      {
        label: 'Reykjanes',
        value: 'Héraðsdómur Reykjaness',
      },
    ]
  }, [])

  const districtCourtTagValues = districtCourtTags.map(({ value }) => value)

  return (
    <Box className="rs_read">
      <HeadWithSocialSharing title={customPageData?.ogTitle ?? heading}>
        {Boolean(customPageData?.configJson?.noIndexOnListPage) && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </HeadWithSocialSharing>
      <Stack space={3}>
        <Box paddingBottom={2}>
          <GridContainer>
            <Stack space={5}>
              <Stack space={3}>
                <Breadcrumbs items={[{ title: 'Ísland.is', href: '/' }]} />
                <Stack space={2}>
                  <Text variant="h1" as="h1">
                    {heading}
                  </Text>
                  <Webreader
                    readClass="rs_read"
                    marginBottom={0}
                    marginTop={0}
                  />
                  <Text variant="intro">
                    {formatMessage(m.listPage.description)}
                  </Text>
                </Stack>
              </Stack>

              <Stack space={3}>
                <Box className={styles.searchInput}>
                  <Input
                    name="verdict-search-input"
                    onChange={(ev) => {
                      setSearchTerm(ev.target.value)
                      setPage(1)
                    }}
                    value={searchTerm}
                    placeholder={formatMessage(
                      m.listPage.searchInputPlaceholder,
                    )}
                    icon={{ name: 'search', type: 'outline' }}
                    backgroundColor="blue"
                  />
                </Box>
                <Inline alignY="center" space={2}>
                  <Tag
                    active={courtFilter === ALL_COURTS_TAG}
                    onClick={() => {
                      setPage(1)
                      setCourtFilter(ALL_COURTS_TAG)
                    }}
                  >
                    {formatMessage(m.listPage.showAllCourts)}
                  </Tag>
                  {courtTags.map((tag) => {
                    let isActive = courtFilter === tag.value
                    if (
                      !isActive &&
                      tag.value === DEFAULT_DISTRICT_COURT_TAG &&
                      districtCourtTagValues.includes(courtFilter)
                    ) {
                      isActive = true
                    }
                    return (
                      <Tag
                        key={tag.value}
                        active={isActive}
                        onClick={() => {
                          setPage(1)
                          setCourtFilter(tag.value)
                        }}
                      >
                        {tag.label}
                      </Tag>
                    )
                  })}
                </Inline>
                {districtCourtTagValues.includes(courtFilter) && (
                  <Inline alignY="center" space={2}>
                    {districtCourtTags.map((tag) => (
                      <Tag
                        key={tag.value}
                        active={courtFilter === tag.value}
                        onClick={() => {
                          setPage(1)
                          setCourtFilter(tag.value)
                        }}
                      >
                        {tag.label}
                      </Tag>
                    ))}
                  </Inline>
                )}
              </Stack>
            </Stack>
          </GridContainer>
        </Box>

        <Box background="blue100" paddingTop={[3, 3, 0]}>
          <SidebarLayout
            fullWidthContent={true}
            sidebarContent={
              <Stack space={3}>
                <Text variant="h5">
                  {formatMessage(m.listPage.sidebarFilterHeading)}
                </Text>
              </Stack>
            }
          >
            <Stack space={3}>
              <Inline justifyContent="spaceBetween" alignY="center" space={2}>
                <Text>
                  <strong>{data.total}</strong>{' '}
                  {formatMessage(
                    m.listPage[
                      data.total === 1
                        ? 'verdictsFoundSingular'
                        : 'verdictsFoundPlural'
                    ],
                  )}
                </Text>
                <Hidden below="lg">
                  <Box>
                    <Button
                      variant="utility"
                      icon={isGridLayout ? 'list' : 'grid'}
                      iconType="outline"
                      colorScheme="white"
                      size="small"
                      onClick={() => {
                        setIsGridLayout((previousState) => !previousState)
                      }}
                    >
                      {formatMessage(
                        isGridLayout
                          ? m.listPage.displayList
                          : m.listPage.displayGrid,
                      )}
                    </Button>
                  </Box>
                </Hidden>
              </Inline>
              <InfoCardGrid
                variant="detailed"
                columns={overrideGridLayoutSetting ? 1 : isGridLayout ? 2 : 1}
                cards={data.visibleVerdicts
                  .filter((verdict) => Boolean(verdict.id))
                  .map((verdict) => {
                    return {
                      description: verdict.title,
                      eyebrow: '',
                      id: verdict.id,
                      link: { href: `/domar/${verdict.id}`, label: '' },
                      title: verdict.caseNumber,
                      borderColor: 'blue200',
                      detailLines: [
                        {
                          icon: 'calendar',
                          text: verdict.verdictDate
                            ? format(
                                new Date(verdict.verdictDate),
                                'd. MMMM yyyy',
                              )
                            : '',
                        },
                        { icon: 'hammer', text: verdict.court ?? '' },
                        {
                          icon: 'person',
                          text: `${verdict.presidentJudge?.name ?? ''} ${
                            verdict.presidentJudge?.title ?? ''
                          }`,
                        },
                      ],
                    }
                  })}
              />
              {initialData.total > data.visibleVerdicts.length && (
                <Box
                  key={page}
                  paddingTop={4}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  {error && (
                    <Box paddingBottom={2}>
                      <Text variant="medium" color="red600">
                        {formatMessage(m.listPage.loadingMoreFailed)}
                      </Text>
                    </Box>
                  )}
                  <Button
                    loading={loading}
                    onClick={() => {
                      setPage((p) => p + 1)
                    }}
                  >
                    {formatMessage(m.listPage.seeMoreVerdicts, {
                      remainingVerdictCount:
                        initialData.total - data.visibleVerdicts.length,
                    })}
                  </Button>
                </Box>
              )}
            </Stack>
          </SidebarLayout>
        </Box>
      </Stack>
    </Box>
  )
}

VerdictsList.getProps = async ({ apolloClient, query, customPageData }) => {
  const searchTerm = parseAsString.parseServerSide(
    query[SEARCH_TERM_QUERY_PARAM_KEY],
  )
  const court = parseAsString.parseServerSide(query[COURT_QUERY_PARAM_KEY])
  const caseCategories = parseAsArrayOf(parseAsString).parseServerSide(
    query.caseCategories,
  )
  const caseTypes = parseAsArrayOf(parseAsString).parseServerSide(
    query.caseTypes,
  )
  const keywords = parseAsArrayOf(parseAsString).parseServerSide(query.keywords)
  const [
    verdictListResponse,
    caseTypesResponse,
    caseCategoriesResponse,
    keywordsResponse,
  ] = await Promise.all([
    apolloClient.query<GetVerdictsQuery, GetVerdictsQueryVariables>({
      query: GET_VERDICTS_QUERY,
      variables: {
        input: {
          searchTerm,
          caseCategories,
          caseTypes,
          keywords,
          page: 1,
          courtLevel: extractCourtLevelFromState(court),
        },
      },
    }),
    apolloClient.query<
      GetVerdictCaseTypesQuery,
      GetVerdictCaseTypesQueryVariables
    >({
      query: GET_VERDICT_CASE_TYPES_QUERY,
    }),
    apolloClient.query<
      GetVerdictCaseCategoriesQuery,
      GetVerdictCaseCategoriesQueryVariables
    >({
      query: GET_VERDICT_CASE_CATEGORIES_QUERY,
    }),
    apolloClient.query<
      GetVerdictKeywordsQuery,
      GetVerdictKeywordsQueryVariables
    >({
      query: GET_VERDICT_KEYWORDS_QUERY,
    }),
  ])

  const items = verdictListResponse.data.webVerdicts.items

  if (!customPageData?.configJson?.showVerdictListPage) {
    throw new CustomNextError(
      404,
      'Verdict list page has been turned off in the CMS',
    )
  }

  return {
    initialData: {
      visibleVerdicts: items.slice(0, ITEMS_PER_PAGE),
      invisibleVerdicts: items.slice(ITEMS_PER_PAGE),
      total: verdictListResponse.data.webVerdicts.total,
    },
    caseTypes: caseTypesResponse.data.webVerdictCaseTypes.caseTypes,
    caseCategories:
      caseCategoriesResponse.data.webVerdictCaseCategories.caseCategories,
    keywords: keywordsResponse.data.webVerdictKeywords.keywords,
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Verdicts, VerdictsList),
  {
    footerVersion: 'organization',
  },
)
