import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import isEqual from 'lodash/isEqual'
import {
  parseAsArrayOf,
  parseAsString,
  useQueryStates,
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
  Select,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
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
  type WebVerdictCaseCategory,
  type WebVerdictKeyword,
  type WebVerdictsInput,
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

enum QueryParam {
  SEARCH_TERM = 'q',
  COURT = 'court',
  KEYWORD = 'keyword',
  CASE_CATEGORY = 'category',
  CASE_NUMBER = 'number',
}

interface VerdictsListProps {
  initialData: {
    visibleVerdicts: GetVerdictsQuery['webVerdicts']['items']
    invisibleVerdicts: GetVerdictsQuery['webVerdicts']['items']
    total: number
  }
  keywords: WebVerdictKeyword[]
  caseCategories: WebVerdictCaseCategory[]
}

const extractCourtLevelFromState = (court: string | null | undefined) =>
  court || ALL_COURTS_TAG

const useVerdictListState = (props: VerdictsListProps) => {
  const initialRender = useRef(true)
  const [queryState, setQueryState] = useQueryStates(
    {
      [QueryParam.SEARCH_TERM]: parseAsString
        .withOptions({
          clearOnDefault: true,
        })
        .withDefault(''),
      [QueryParam.COURT]: parseAsString
        .withOptions({
          clearOnDefault: true,
        })
        .withDefault(ALL_COURTS_TAG),
      [QueryParam.KEYWORD]: parseAsString
        .withOptions({ clearOnDefault: true })
        .withDefault(''),
      [QueryParam.CASE_CATEGORY]: parseAsString
        .withOptions({ clearOnDefault: true })
        .withDefault(''),
      [QueryParam.CASE_NUMBER]: parseAsString
        .withOptions({ clearOnDefault: true })
        .withDefault(''),
    },
    {
      throttleMs: DEBOUNCE_TIME_IN_MS,
      shallow: true,
    },
  )
  const [page, setPage] = useState(1)
  const [data, setData] = useState(props.initialData)
  const [total, setTotal] = useState(props.initialData.total)
  const queryStateRef = useRef<typeof queryState>(queryState)
  const pageRef = useRef(page)

  const updatePage = useCallback((newPage: number) => {
    setPage(newPage)
    pageRef.current = newPage
  }, [])

  const updateQueryState = useCallback(
    (key: keyof typeof queryState, value: typeof queryState[typeof key]) => {
      updatePage(1)
      setQueryState((previousState) => {
        const updatedState = { ...previousState, [key]: value }
        queryStateRef.current = updatedState
        return updatedState
      })
    },
    [setQueryState, updatePage],
  )

  const convertQueryParamsToInput = useCallback(
    (queryParams: typeof queryState, page: number): WebVerdictsInput => {
      const keyword = queryParams[QueryParam.KEYWORD]
      const category = queryParams[QueryParam.CASE_CATEGORY]
      return {
        page,
        searchTerm: queryParams[QueryParam.SEARCH_TERM],
        courtLevel: extractCourtLevelFromState(queryParams[QueryParam.COURT]),
        caseNumber: queryParams[QueryParam.CASE_NUMBER],
        keywords: keyword ? [keyword] : null,
        caseCategories: category ? [category] : null,
        caseTypes: null,
      }
    },
    [],
  )

  const [fetchVerdicts, { loading, error }] = useLazyQuery<
    GetVerdictsQuery,
    GetVerdictsQueryVariables
  >(GET_VERDICTS_QUERY)

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }

    fetchVerdicts({
      variables: {
        input: convertQueryParamsToInput(queryState, page),
      },
      onCompleted(response) {
        // We skip processing the response if we've changed query params since the request
        {
          const input = { ...response.webVerdicts.input }
          delete input['__typename']

          console.log({
            input,
            state: convertQueryParamsToInput(
              queryStateRef.current,
              pageRef.current,
            ),
            response,
          })
          if (
            !isEqual(
              input,
              convertQueryParamsToInput(queryStateRef.current, pageRef.current),
            )
          ) {
            console.log({ ignoring: true })
            return
          }
        }

        let totalAccordingToFirstPage = total
        const isFirstPage = response.webVerdicts.input.page === 1
        if (isFirstPage) {
          totalAccordingToFirstPage = response.webVerdicts.total
          setTotal(totalAccordingToFirstPage)
        }

        setData((prevData) => {
          let verdicts = [...response.webVerdicts.items]

          if (!isFirstPage) {
            verdicts = verdicts
              .concat(prevData.invisibleVerdicts)
              // Remove all duplicate verdicts in case there were new verdicts published since last page load
              .filter(
                (verdict) =>
                  !verdict.id ||
                  !prevData.visibleVerdicts
                    .map(({ id }) => id)
                    .includes(verdict.id),
              )
          }

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
            visibleVerdicts: (isFirstPage
              ? []
              : prevData.visibleVerdicts
            ).concat(verdicts.slice(0, ITEMS_PER_PAGE)),
            invisibleVerdicts: verdicts.slice(ITEMS_PER_PAGE),
            total: totalAccordingToFirstPage,
          }
        })
      },
    })
  }, [convertQueryParamsToInput, fetchVerdicts, page, queryState, total])

  return {
    queryState,
    updateQueryState,
    loading,
    error,
    data,
    page,
    updatePage,
    total,
  }
}

const VerdictsList: CustomScreen<VerdictsListProps> = (props) => {
  const {
    queryState,
    updateQueryState,
    loading,
    error,
    data,
    page,
    updatePage,
    total,
  } = useVerdictListState(props)
  const { customPageData, keywords, caseCategories } = props

  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const { format } = useDateUtils()
  const { formatMessage } = useIntl()

  const heading = formatMessage(m.listPage.heading)

  const courtTags = useMemo(() => {
    return [
      {
        label: formatMessage(m.listPage.showAllCourts),
        value: ALL_COURTS_TAG,
      },
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

  const keywordOptions = useMemo(() => {
    return [{ label: '', value: '' }].concat(
      keywords.map((keyword) => ({
        label: keyword.label,
        value: keyword.label,
      })),
    )
  }, [keywords])
  const caseCategoryOptions = useMemo(() => {
    return [{ label: '', value: '' }].concat(
      caseCategories.map((category) => ({
        label: category.label,
        value: category.label,
      })),
    )
  }, [caseCategories])

  const districtCourtTagValues = districtCourtTags.map(({ value }) => value)

  const handleInputKeyDown = (ev: { key: string; target: unknown }) => {
    if (ev.key === 'Enter') {
      // Remove focus from input field after pressing enter
      ;(ev.target as { blur?: () => void })?.blur?.()
    }
  }

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
                    ref={searchInputRef}
                    name="verdict-search-input"
                    onChange={(ev) => {
                      updateQueryState(QueryParam.SEARCH_TERM, ev.target.value)
                    }}
                    onKeyDown={handleInputKeyDown}
                    placeholder={formatMessage(
                      m.listPage.searchInputPlaceholder,
                    )}
                    icon={{ name: 'search', type: 'outline' }}
                    backgroundColor="blue"
                    loading={loading}
                  />
                </Box>
                <Hidden above="xs">
                  <Select
                    options={courtTags}
                    value={courtTags.find(
                      (tag) => tag.value === queryState[QueryParam.COURT],
                    )}
                    label={formatMessage(m.listPage.courtSelectLabel)}
                    onChange={(option) => {
                      if (option)
                        updateQueryState(QueryParam.COURT, option.value)
                    }}
                    size="sm"
                    backgroundColor="blue"
                  />
                </Hidden>
                <Hidden below="sm">
                  <Inline alignY="center" space={2}>
                    {courtTags.map((tag) => {
                      let isActive = queryState[QueryParam.COURT] === tag.value
                      if (
                        !isActive &&
                        tag.value === DEFAULT_DISTRICT_COURT_TAG &&
                        districtCourtTagValues.includes(
                          queryState[QueryParam.COURT],
                        )
                      ) {
                        isActive = true
                      }
                      return (
                        <Tag
                          key={tag.value}
                          active={isActive}
                          onClick={() => {
                            updateQueryState(QueryParam.COURT, tag.value)
                          }}
                        >
                          {tag.label}
                        </Tag>
                      )
                    })}
                  </Inline>
                </Hidden>
                {districtCourtTagValues.includes(
                  queryState[QueryParam.COURT],
                ) && (
                  <>
                    <Hidden below="sm">
                      <Inline alignY="center" space={2}>
                        {districtCourtTags.map((tag) => (
                          <Tag
                            key={tag.value}
                            active={queryState[QueryParam.COURT] === tag.value}
                            onClick={() => {
                              updateQueryState(QueryParam.COURT, tag.value)
                            }}
                          >
                            {tag.label}
                          </Tag>
                        ))}
                      </Inline>
                    </Hidden>
                    <Hidden above="xs">
                      <Select
                        options={districtCourtTags}
                        value={districtCourtTags.find(
                          (tag) => tag.value === queryState[QueryParam.COURT],
                        )}
                        label={formatMessage(
                          m.listPage.districtCourtSelectLabel,
                        )}
                        onChange={(option) => {
                          if (option)
                            updateQueryState(QueryParam.COURT, option.value)
                        }}
                        size="sm"
                        backgroundColor="blue"
                      />
                    </Hidden>
                  </>
                )}
              </Stack>
            </Stack>
          </GridContainer>
        </Box>

        <Box background="blue100" paddingTop={[3, 3, 0]}>
          <SidebarLayout
            fullWidthContent={false}
            sidebarContent={
              <Stack space={3}>
                <Text variant="h5">
                  {formatMessage(m.listPage.sidebarFilterHeading)}
                </Text>
                <Stack space={5}>
                  <Input
                    size="sm"
                    label={formatMessage(m.listPage.caseNumberInputLabel)}
                    name="casenumber-input"
                    onChange={(ev) => {
                      updateQueryState(QueryParam.CASE_NUMBER, ev.target.value)
                    }}
                    onKeyDown={handleInputKeyDown}
                  />
                  <Stack space={1}>
                    <Select
                      label={formatMessage(m.listPage.keywordSelectLabel)}
                      size="sm"
                      options={keywordOptions}
                      value={keywordOptions.find(
                        (option) =>
                          option.value === queryState[QueryParam.KEYWORD],
                      )}
                      onChange={(option) => {
                        if (option)
                          updateQueryState(QueryParam.KEYWORD, option.value)
                      }}
                    />
                  </Stack>
                  <Stack space={1}>
                    <Select
                      label={formatMessage(m.listPage.caseCategorySelectLabel)}
                      size="sm"
                      options={caseCategoryOptions}
                      value={caseCategoryOptions.find(
                        (option) =>
                          option.value === queryState[QueryParam.CASE_CATEGORY],
                      )}
                      onChange={(option) => {
                        if (option) {
                          updateQueryState(
                            QueryParam.CASE_CATEGORY,
                            option.value,
                          )
                        }
                      }}
                    />
                  </Stack>
                </Stack>
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
              </Inline>
              <InfoCardGrid
                variant="detailed-reveal"
                columns={1}
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
                      subDescription: verdict.keywords.join(', '),
                      revealMoreButtonProps: {
                        revealLabel: formatMessage(
                          m.listPage.revealPresentings,
                        ),
                        hideLabel: formatMessage(m.listPage.hidePresentings),
                        revealedText: verdict.presentings,
                      },
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
              {total > data.visibleVerdicts.length && (
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
                      updatePage(page + 1)
                    }}
                  >
                    {formatMessage(m.listPage.seeMoreVerdicts, {
                      remainingVerdictCount:
                        total - data.visibleVerdicts.length,
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
    query[QueryParam.SEARCH_TERM],
  )
  const court = parseAsString.parseServerSide(query[QueryParam.COURT])
  const caseCategories = parseAsArrayOf(parseAsString).parseServerSide(
    query[QueryParam.CASE_CATEGORY],
  )
  const caseTypes = parseAsArrayOf(parseAsString).parseServerSide(
    query.caseTypes,
  )
  const keywords = parseAsArrayOf(parseAsString).parseServerSide(
    query[QueryParam.KEYWORD],
  )

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
