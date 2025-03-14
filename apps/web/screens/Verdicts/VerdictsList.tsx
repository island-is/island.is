import { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import { parseAsArrayOf, parseAsString } from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  Breadcrumbs,
  Button,
  GridContainer,
  Hidden,
  InfoCardGrid,
  Inline,
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

const ITEMS_PER_PAGE = 10

const ALL_COURTS_TAG = ''
const DISTRICT_COURT_TAG = 'Héraðsdómstólar'
const ALL_DISTRICT_COURTS_TAG = ''

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

  const [fetchVerdicts, { loading, error }] = useLazyQuery<
    GetVerdictsQuery,
    GetVerdictsQueryVariables
  >(GET_VERDICTS_QUERY)

  useEffect(() => {
    if (page <= 1) {
      return
    }

    fetchVerdicts({
      variables: {
        input: {
          page,
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
  }, [fetchVerdicts, initialData.total, page])

  const [isGridLayout, setIsGridLayout] = useState(false)
  const overrideGridLayoutSetting = width < theme.breakpoints.lg
  const heading = formatMessage(m.listPage.heading)

  const [courtFilter, setCourtFilter] = useState(ALL_COURTS_TAG)
  const [districtCourtFilter, setDistrictCourtFilter] = useState(
    ALL_DISTRICT_COURTS_TAG,
  )

  const courtTags = useMemo(() => {
    return [
      {
        label: formatMessage(m.listPage.showDistrictCourts),
        value: 'Héraðsdómstólar',
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
        value: 'Héraðsdómur Reykjavíkur',
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

  return (
    <Box className="rs_read">
      <HeadWithSocialSharing title={customPageData?.ogTitle ?? heading}>
        {Boolean(customPageData?.configJson?.noIndexOnListPage) && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </HeadWithSocialSharing>
      <Stack space={3}>
        <GridContainer>
          <Stack space={3}>
            <Breadcrumbs items={[{ title: 'Ísland.is', href: '/' }]} />
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {heading}
              </Text>
              <Webreader readClass="rs_read" marginBottom={0} marginTop={0} />
              <Text variant="intro">
                {formatMessage(m.listPage.description)}
              </Text>
            </Stack>
            <Inline alignY="center" space={2}>
              <Tag
                active={courtFilter === ALL_COURTS_TAG}
                onClick={() => {
                  setCourtFilter(ALL_COURTS_TAG)
                }}
              >
                {formatMessage(m.listPage.showAllCourts)}
              </Tag>
              {courtTags.map((tag) => (
                <Tag
                  key={tag.value}
                  active={courtFilter === tag.value}
                  onClick={() => {
                    setCourtFilter(tag.value)
                    setDistrictCourtFilter(ALL_DISTRICT_COURTS_TAG)
                  }}
                >
                  {tag.label}
                </Tag>
              ))}
            </Inline>
            {courtFilter === DISTRICT_COURT_TAG && (
              <Inline alignY="center" space={2}>
                <Tag
                  active={districtCourtFilter === ALL_DISTRICT_COURTS_TAG}
                  onClick={() => {
                    setDistrictCourtFilter(ALL_DISTRICT_COURTS_TAG)
                  }}
                >
                  {formatMessage(m.listPage.showAllDistrictCourts)}
                </Tag>
                {districtCourtTags.map((tag) => (
                  <Tag
                    key={tag.value}
                    active={districtCourtFilter === tag.value}
                    onClick={() => {
                      setDistrictCourtFilter(tag.value)
                    }}
                  >
                    {tag.label}
                  </Tag>
                ))}
              </Inline>
            )}
          </Stack>
        </GridContainer>
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
                  {formatMessage(m.listPage.verdictsFound)}
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
  const searchTerm = parseAsString.withDefault('').parseServerSide(query.q)
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
