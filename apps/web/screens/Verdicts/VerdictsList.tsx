import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import isEqual from 'lodash/isEqual'
import {
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsString,
  useQueryStates,
} from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  AccordionItem,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Filter,
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
  type WebVerdictCaseType,
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
  CASE_CATEGORIES = 'caseCategories',
  CASE_TYPES = 'caseTypes',
  CASE_NUMBER = 'number',
  LAWS = 'laws',
  DATE_FROM = 'dateFrom',
  DATE_TO = 'dateTo',
}

interface VerdictsListProps {
  initialData: {
    visibleVerdicts: GetVerdictsQuery['webVerdicts']['items']
    invisibleVerdicts: GetVerdictsQuery['webVerdicts']['items']
    total: number
  }
  keywords: WebVerdictKeyword[]
  caseCategories: WebVerdictCaseCategory[]
  caseTypes: WebVerdictCaseType[]
}

const handleInputKeyDown = (ev: { key: string; target: unknown }) => {
  if (ev.key === 'Enter') {
    // Remove focus from input field after pressing enter
    ;(ev.target as { blur?: () => void })?.blur?.()
  }
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
      [QueryParam.CASE_CATEGORIES]: parseAsArrayOf(
        parseAsString.withOptions({ clearOnDefault: true }),
      ).withOptions({
        clearOnDefault: true,
      }),
      [QueryParam.CASE_TYPES]: parseAsArrayOf(
        parseAsString.withOptions({ clearOnDefault: true }),
      ).withOptions({
        clearOnDefault: true,
      }),
      [QueryParam.CASE_NUMBER]: parseAsString
        .withOptions({ clearOnDefault: true })
        .withDefault(''),
      [QueryParam.LAWS]: parseAsString
        .withOptions({ clearOnDefault: true })
        .withDefault(''),
      [QueryParam.DATE_FROM]: parseAsIsoDateTime.withOptions({
        clearOnDefault: true,
      }),
      [QueryParam.DATE_TO]: parseAsIsoDateTime.withOptions({
        clearOnDefault: true,
      }),
    },
    {
      throttleMs: DEBOUNCE_TIME_IN_MS,
      shallow: true,
    },
  )
  const [page, setPage] = useState(1)
  const [data, setData] = useState(props.initialData)
  const [total, setTotal] = useState(props.initialData.total)
  const queryStateRef = useRef<typeof queryState | null>(queryState)
  const pageRef = useRef(page)

  const updatePage = useCallback((newPage: number) => {
    setPage(newPage)
    pageRef.current = newPage
  }, [])

  const updateQueryState = useCallback(
    (
      key: keyof typeof queryState,
      value:
        | typeof queryState[typeof key]
        | ((previousState: typeof queryState) => typeof queryState),
    ) => {
      updatePage(1)
      setQueryState((previousState) => {
        const updatedState =
          typeof value === 'function'
            ? value(previousState)
            : { ...previousState, [key]: value }
        queryStateRef.current = updatedState
        return updatedState
      })
    },
    [setQueryState, updatePage],
  )

  const convertQueryParamsToInput = useCallback(
    (queryParams: typeof queryState, page: number): WebVerdictsInput => {
      const keyword = queryParams[QueryParam.KEYWORD]
      const laws = queryParams[QueryParam.LAWS]
      return {
        page,
        searchTerm: queryParams[QueryParam.SEARCH_TERM],
        courtLevel: extractCourtLevelFromState(queryParams[QueryParam.COURT]),
        caseNumber: queryParams[QueryParam.CASE_NUMBER],
        keywords: keyword ? [keyword] : null,
        caseCategories: queryParams[QueryParam.CASE_CATEGORIES],
        caseTypes: queryParams[QueryParam.CASE_TYPES],
        laws: laws ? [laws] : null,
        dateFrom: queryParams[QueryParam.DATE_FROM]?.toISOString() ?? null,
        dateTo: queryParams[QueryParam.DATE_TO]?.toISOString() ?? null,
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
        if (queryStateRef.current) {
          const input = { ...response.webVerdicts.input }
          delete input['__typename']

          if (
            !isEqual(
              input,
              convertQueryParamsToInput(queryStateRef.current, pageRef.current),
            )
          ) {
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

  const resetQueryState = useCallback(() => {
    updatePage(1)
    setQueryState(null)
    queryStateRef.current = null
  }, [setQueryState, updatePage])

  return {
    queryState,
    updateQueryState,
    resetQueryState,
    loading,
    error,
    data,
    page,
    updatePage,
    total,
  }
}

interface FiltersProps {
  startExpanded?: boolean
  queryState: ReturnType<typeof useVerdictListState>['queryState']
  updateQueryState: ReturnType<typeof useVerdictListState>['updateQueryState']
  keywords: VerdictsListProps['keywords']
  caseCategories: VerdictsListProps['caseCategories']
  caseTypes: VerdictsListProps['caseTypes']
}

const Filters = ({
  startExpanded = false,
  queryState,
  keywords,
  caseCategories,
  caseTypes,
  updateQueryState,
}: FiltersProps) => {
  const { formatMessage } = useIntl()

  const keywordOptions = useMemo(() => {
    return keywords.map((keyword) => ({
      label: keyword.label,
      value: keyword.label,
    }))
  }, [keywords])
  const caseCategoryOptions = useMemo(() => {
    return caseCategories.map((category) => ({
      label: category.label,
      value: category.label,
    }))
  }, [caseCategories])
  const caseTypeOptions = useMemo(() => {
    return caseTypes.map((caseType) => ({
      label: caseType.label,
      value: caseType.label,
    }))
  }, [caseTypes])

  return (
    <Stack space={4}>
      <AccordionItem
        id="case-number-accordion"
        label={formatMessage(m.listPage.caseNumberSelectLabel)}
        startExpanded={startExpanded}
        iconVariant="small"
        labelVariant="h5"
        labelColor={queryState[QueryParam.CASE_NUMBER] ? 'blue400' : undefined}
      >
        <Input
          size="sm"
          label={formatMessage(m.listPage.caseNumberInputLabel)}
          name="casenumber-input"
          onChange={(ev) => {
            updateQueryState(QueryParam.CASE_NUMBER, ev.target.value)
          }}
          onKeyDown={handleInputKeyDown}
          value={queryState[QueryParam.CASE_NUMBER]}
        />
      </AccordionItem>

      <Divider />

      <AccordionItem
        id="laws-accordion"
        label={formatMessage(m.listPage.lawsSelectLabel)}
        startExpanded={startExpanded}
        iconVariant="small"
        labelVariant="h5"
        labelColor={queryState[QueryParam.LAWS] ? 'blue400' : undefined}
      >
        <Input
          size="sm"
          label={formatMessage(m.listPage.lawsInputLabel)}
          name="laws-input"
          onChange={(ev) => {
            updateQueryState(QueryParam.LAWS, ev.target.value)
          }}
          onKeyDown={handleInputKeyDown}
          defaultValue={queryState[QueryParam.LAWS]}
        />
      </AccordionItem>

      <Divider />

      <AccordionItem
        id="keywords-accordion"
        label={formatMessage(m.listPage.keywordSelectLabel)}
        startExpanded={startExpanded}
        iconVariant="small"
        labelVariant="h5"
        labelColor={queryState[QueryParam.KEYWORD] ? 'blue400' : undefined}
      >
        <Select
          size="sm"
          options={keywordOptions}
          value={keywordOptions.find(
            (option) => option.value === queryState[QueryParam.KEYWORD],
          )}
          onChange={(option) => {
            if (option) updateQueryState(QueryParam.KEYWORD, option.value)
          }}
          placeholder={formatMessage(m.listPage.keywordSelectPlaceholder)}
        />
      </AccordionItem>

      <Divider />

      <AccordionItem
        id="case-category-accordion"
        label={formatMessage(m.listPage.caseCategorySelectLabel)}
        startExpanded={startExpanded}
        iconVariant="small"
        labelVariant="h5"
        labelColor={
          queryState[QueryParam.CASE_CATEGORIES] ? 'blue400' : undefined
        }
      >
        <Stack space={2}>
          {caseCategoryOptions.map((option) => (
            <Checkbox
              id={option.value}
              key={option.value}
              name={option.value}
              label={option.label}
              checked={Boolean(
                queryState[QueryParam.CASE_CATEGORIES]?.includes(option.value),
              )}
              onChange={(event) => {
                updateQueryState(
                  QueryParam.CASE_CATEGORIES,
                  (previousState) => {
                    let updatedCaseCategories = [
                      ...(previousState[QueryParam.CASE_CATEGORIES] ?? []),
                    ]
                    if (event.target.checked) {
                      updatedCaseCategories.push(option.value)
                    } else {
                      updatedCaseCategories = updatedCaseCategories.filter(
                        (value) => value !== option.value,
                      )
                    }
                    return {
                      ...previousState,
                      [QueryParam.CASE_CATEGORIES]:
                        updatedCaseCategories.length === 0
                          ? null
                          : updatedCaseCategories,
                    }
                  },
                )
              }}
            />
          ))}
        </Stack>
      </AccordionItem>

      <Divider />

      <AccordionItem
        id="case-types-accordion"
        label={formatMessage(m.listPage.caseTypeSelectLabel)}
        startExpanded={startExpanded}
        iconVariant="small"
        labelVariant="h5"
        labelColor={queryState[QueryParam.CASE_TYPES] ? 'blue400' : undefined}
      >
        <Stack space={2}>
          {caseTypeOptions.map((option) => (
            <Checkbox
              id={option.value}
              key={option.value}
              name={option.value}
              label={option.label}
              checked={Boolean(
                queryState[QueryParam.CASE_TYPES]?.includes(option.value),
              )}
              onChange={(event) => {
                updateQueryState(QueryParam.CASE_TYPES, (previousState) => {
                  let updatedCaseTypes = [
                    ...(previousState[QueryParam.CASE_TYPES] ?? []),
                  ]
                  if (event.target.checked) {
                    updatedCaseTypes.push(option.value)
                  } else {
                    updatedCaseTypes = updatedCaseTypes.filter(
                      (value) => value !== option.value,
                    )
                  }
                  return {
                    ...previousState,
                    [QueryParam.CASE_TYPES]:
                      updatedCaseTypes.length === 0 ? null : updatedCaseTypes,
                  }
                })
              }}
            />
          ))}
        </Stack>
      </AccordionItem>

      <Divider />

      <AccordionItem
        id="date-accordion"
        label={formatMessage(m.listPage.dateSelectLabel)}
        startExpanded={startExpanded}
        iconVariant="small"
        labelVariant="h5"
        labelColor={
          Boolean(queryState[QueryParam.DATE_FROM]) ||
          Boolean(queryState[QueryParam.DATE_TO])
            ? 'blue400'
            : undefined
        }
      >
        <Stack space={2}>
          <DatePicker
            name="from"
            label={formatMessage(m.listPage.dateFromLabel)}
            placeholderText=""
            size="sm"
            handleChange={(date) => {
              updateQueryState(QueryParam.DATE_FROM, date)
            }}
            selected={queryState[QueryParam.DATE_FROM]}
            maxDate={queryState[QueryParam.DATE_TO]}
          />
          <DatePicker
            name="from"
            label={formatMessage(m.listPage.dateToLabel)}
            placeholderText=""
            size="sm"
            handleChange={(date) => {
              updateQueryState(QueryParam.DATE_TO, date)
            }}
            selected={queryState[QueryParam.DATE_TO]}
            minDate={queryState[QueryParam.DATE_FROM]}
          />
        </Stack>
      </AccordionItem>
    </Stack>
  )
}

const VerdictsList: CustomScreen<VerdictsListProps> = (props) => {
  const {
    queryState,
    updateQueryState,
    resetQueryState,
    loading,
    error,
    data,
    page,
    updatePage,
    total,
  } = useVerdictListState(props)
  const { customPageData, keywords, caseCategories, caseTypes } = props

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
                      updateQueryState(QueryParam.SEARCH_TERM, ev.target.value)
                    }}
                    onKeyDown={handleInputKeyDown}
                    placeholder={formatMessage(
                      m.listPage.searchInputPlaceholder,
                    )}
                    icon={{ name: 'search', type: 'outline' }}
                    backgroundColor="blue"
                    loading={loading}
                    value={queryState[QueryParam.SEARCH_TERM]}
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

        <Box
          background="blue100"
          paddingTop={[3, 3, 0]}
          className={styles.mainContainer}
        >
          <SidebarLayout
            fullWidthContent={false}
            hiddenOnTablet={true}
            isSticky={false}
            sidebarContent={
              <Stack space={3}>
                <Text variant="h5">
                  {formatMessage(m.listPage.sidebarFilterHeading)}
                </Text>
                <Box background="white" padding={3} borderRadius="large">
                  <Filters
                    startExpanded={true}
                    caseCategories={caseCategories}
                    caseTypes={caseTypes}
                    keywords={keywords}
                    queryState={queryState}
                    updateQueryState={updateQueryState}
                  />
                </Box>
                <Box
                  background="blue100"
                  width="full"
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  style={{ height: 72 }}
                >
                  <Button
                    variant="text"
                    icon="reload"
                    size="small"
                    onClick={resetQueryState}
                  >
                    {formatMessage(m.listPage.clearAllFiltersLabel)}
                  </Button>
                </Box>
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
                <Hidden above="md">
                  <Filter
                    resultCount={data.total}
                    variant="dialog"
                    labelClear={formatMessage(m.listPage.clearAllFiltersLabel)}
                    labelClearAll={formatMessage(
                      m.listPage.clearAllFiltersLabel,
                    )}
                    labelOpen={formatMessage(m.listPage.openFilter)}
                    labelClose={formatMessage(m.listPage.closeFilter)}
                    labelResult={formatMessage(m.listPage.viewResults)}
                    labelTitle={formatMessage(m.listPage.sidebarFilterHeading)}
                    onFilterClear={resetQueryState}
                    usePopoverDiscloureButtonStyling
                  >
                    <Box paddingY={3}>
                      <Filters
                        caseCategories={caseCategories}
                        caseTypes={caseTypes}
                        keywords={keywords}
                        queryState={queryState}
                        updateQueryState={updateQueryState}
                      />
                    </Box>
                  </Filter>
                </Hidden>
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
  const caseNumber = parseAsString.parseServerSide(
    query[QueryParam.CASE_NUMBER],
  )
  const court = parseAsString.parseServerSide(query[QueryParam.COURT])
  const caseCategories = parseAsArrayOf(parseAsString).parseServerSide(
    query[QueryParam.CASE_CATEGORIES],
  )
  const caseTypes = parseAsArrayOf(parseAsString).parseServerSide(
    query.caseTypes,
  )
  const keywords = parseAsArrayOf(parseAsString).parseServerSide(
    query[QueryParam.KEYWORD],
  )
  const laws = parseAsArrayOf(parseAsString).parseServerSide(
    query[QueryParam.LAWS],
  )
  const dateFrom = parseAsString.parseServerSide(query[QueryParam.DATE_FROM])
  const dateTo = parseAsString.parseServerSide(query[QueryParam.DATE_TO])

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
          laws,
          caseNumber,
          dateFrom,
          dateTo,
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
