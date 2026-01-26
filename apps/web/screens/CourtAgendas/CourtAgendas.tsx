import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import isEqual from 'lodash/isEqual'
import {
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsString,
  useQueryStates,
} from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  Accordion,
  AccordionItem,
  Box,
  type BoxProps,
  Breadcrumbs,
  Button,
  Filter,
  GridContainer,
  Hidden,
  Inline,
  Select,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import {
  AddToCalendarButton,
  FilterTag,
  HeadWithSocialSharing,
  Webreader,
} from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  type GetCourtAgendasQuery,
  type GetCourtAgendasQueryVariables,
  GetScheduleTypesQuery,
  GetScheduleTypesQueryVariables,
  type GetVerdictLawyersQuery,
  type GetVerdictLawyersQueryVariables,
  type Query,
  type WebCourtAgendasInput,
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
  GET_COURT_AGENDAS_QUERY,
  GET_SCHEDULE_TYPES_QUERY,
  GET_VERDICT_LAWYERS_QUERY,
} from '../queries/CourtAgendas'
import { AgendaCard } from './components/AgendaCard'
import { DebouncedDatePicker } from './components/DebouncedDatePicker'
import { m } from './translations.strings'
import * as styles from './CourtAgendas.css'

const ITEMS_PER_PAGE = 10
const DEBOUNCE_TIME_IN_MS = 500

const ALL_COURTS_TAG = ''
const DEFAULT_DISTRICT_COURT_TAG = 'Héraðsdómstólar'

const DISTRICT_COURT_TAGS = [
  {
    label: 'Reykjavík',
    value: 'hd-reykjavik',
  },
  {
    label: 'Vesturland',
    value: 'hd-vesturland',
  },
  {
    label: 'Vestfirðir',
    value: 'hd-vestfirdir',
  },
  {
    label: 'Norðurland vestra',
    value: 'hd-nordurland-vestra',
  },
  {
    label: 'Norðurland eystra',
    value: 'hd-nordurland-eystra',
  },
  {
    label: 'Austurland',
    value: 'hd-austurland',
  },
  {
    label: 'Suðurland',
    value: 'hd-sudurland',
  },
  {
    label: 'Reykjanes',
    value: 'hd-reykjanes',
  },
]

enum QueryParam {
  COURT = 'court',
  DISTRICT_COURTS = 'districtCourts',
  DATE_FROM = 'dateFrom',
  DATE_TO = 'dateTo',
  LAWYER = 'lawyer',
  SCHEDULE_TYPES = 'scheduleTypes',
}

interface CourtAgendasProps {
  initialData: {
    visibleCourtAgendas: GetCourtAgendasQuery['webCourtAgendas']['items']
    invisibleCourtAgendas: GetCourtAgendasQuery['webCourtAgendas']['items']
    total: number
  }
  lawyers: GetVerdictLawyersQuery['webVerdictLawyers']['lawyers']
  scheduleTypes: Query['webCourtScheduleTypes']
}

const extractCourtLevelFromState = (court: string | null | undefined) => {
  if (court === DEFAULT_DISTRICT_COURT_TAG) {
    return DISTRICT_COURT_TAGS.map((tag) => tag.value).join(',')
  }
  return court || ALL_COURTS_TAG
}

const useCourtAgendasState = (props: CourtAgendasProps) => {
  const initialRender = useRef(true)
  const [renderKey, setRenderKey] = useState(1)
  const [queryState, setQueryState] = useQueryStates(
    {
      [QueryParam.COURT]: parseAsString
        .withOptions({
          clearOnDefault: true,
        })
        .withDefault(ALL_COURTS_TAG),
      [QueryParam.DISTRICT_COURTS]: parseAsArrayOf(parseAsString)
        .withOptions({ clearOnDefault: true })
        .withDefault([]),
      [QueryParam.DATE_FROM]: parseAsIsoDateTime.withOptions({
        clearOnDefault: true,
      }),
      [QueryParam.DATE_TO]: parseAsIsoDateTime.withOptions({
        clearOnDefault: true,
      }),
      [QueryParam.LAWYER]: parseAsString.withOptions({
        clearOnDefault: true,
      }),
      [QueryParam.SCHEDULE_TYPES]: parseAsString.withOptions({
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
    (queryParams: typeof queryState, page: number): WebCourtAgendasInput => {
      return {
        page,
        court:
          queryParams[QueryParam.DISTRICT_COURTS]?.length > 0
            ? queryParams[QueryParam.DISTRICT_COURTS].join(',')
            : extractCourtLevelFromState(queryParams[QueryParam.COURT]),
        dateFrom: queryParams[QueryParam.DATE_FROM]?.toISOString() ?? null,
        dateTo: queryParams[QueryParam.DATE_TO]?.toISOString() ?? null,
        lawyer: queryParams[QueryParam.LAWYER] ?? null,
        scheduleTypes: queryParams[QueryParam.SCHEDULE_TYPES]
          ? [queryParams[QueryParam.SCHEDULE_TYPES]]
          : null,
      }
    },
    [],
  )

  const [fetchCourtAgendas, { loading, error }] = useLazyQuery<
    GetCourtAgendasQuery,
    GetCourtAgendasQueryVariables
  >(GET_COURT_AGENDAS_QUERY)

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }

    fetchCourtAgendas({
      variables: {
        input: convertQueryParamsToInput(queryState, page),
      },
      onCompleted(response) {
        // We skip processing the response if we've changed query params since the request
        if (queryStateRef.current) {
          const input = { ...response.webCourtAgendas.input }
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
        const isFirstPage = response.webCourtAgendas.input.page === 1
        if (isFirstPage) {
          totalAccordingToFirstPage = response.webCourtAgendas.total
          setTotal(totalAccordingToFirstPage)
        }

        setData((prevData) => {
          let courtAgendas = [...response.webCourtAgendas.items]

          if (!isFirstPage) {
            courtAgendas = courtAgendas
              .concat(prevData.invisibleCourtAgendas)
              // Remove all duplicates in case there were new agendas published since last page load
              .filter(
                (courtAgenda) =>
                  !courtAgenda.id ||
                  !prevData.visibleCourtAgendas
                    .map(({ id }) => id)
                    .includes(courtAgenda.id),
              )
          }

          courtAgendas.sort((a, b) => {
            if (!a.dateFrom && !b.dateFrom) return 0
            if (!b.dateFrom) return 1
            if (!a.dateFrom) return -1
            const dateFromDiff =
              new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
            if (dateFromDiff !== 0) return dateFromDiff
            if (!a.dateTo && !b.dateTo) return 0
            if (!b.dateTo) return 1
            if (!a.dateTo) return -1
            return new Date(a.dateTo).getTime() - new Date(b.dateTo).getTime()
          })

          return {
            visibleCourtAgendas: (isFirstPage
              ? []
              : prevData.visibleCourtAgendas
            ).concat(courtAgendas.slice(0, ITEMS_PER_PAGE)),
            invisibleCourtAgendas: courtAgendas.slice(ITEMS_PER_PAGE),
            total: totalAccordingToFirstPage,
          }
        })
      },
    })
  }, [convertQueryParamsToInput, fetchCourtAgendas, page, queryState, total])

  const resetQueryState = useCallback(() => {
    updatePage(1)
    setQueryState(null)
    setRenderKey((key) => key + 1)
    queryStateRef.current = null
  }, [setQueryState, updatePage])

  const updateRenderKey = useCallback(() => {
    setRenderKey((key) => key + 1)
  }, [])

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
    renderKey,
    updateRenderKey,
  }
}

const FILTER_ACCORDION_ITEM_IDS = [
  'date-accordion',
  'lawyer-accordion',
  'schedule-type-accordion',
]

interface FiltersProps {
  startExpanded?: boolean
  queryState: ReturnType<typeof useCourtAgendasState>['queryState']
  updateQueryState: ReturnType<typeof useCourtAgendasState>['updateQueryState']
  renderKey: string | number
  updateRenderKey: () => void
  whiteBackground?: boolean
  lawyerOptions: { label: string; value: string }[]
  scheduleTypesOptions: { label: string; value: string }[]
}

const Filters = ({
  startExpanded = false,
  queryState,
  updateQueryState,
  renderKey,
  updateRenderKey,
  whiteBackground = false,
  lawyerOptions,
  scheduleTypesOptions,
}: FiltersProps) => {
  const { formatMessage } = useIntl()
  const [expandedItemIds, setExpandedItemIds] = useState<string[]>(
    startExpanded ? FILTER_ACCORDION_ITEM_IDS : [],
  )
  const [openFiltersToggle, setOpenFiltersToggle] = useState(!startExpanded)

  const handleToggle = useCallback((expanded: boolean, itemId: string) => {
    if (!expanded) {
      setExpandedItemIds((prev) => prev.filter((id) => id !== itemId))
    } else {
      setExpandedItemIds((prev) => [...prev, itemId])
    }
  }, [])

  const boxProps: BoxProps = whiteBackground
    ? {
        padding: 3,
        borderRadius: 'large',
        background: 'white',
      }
    : {}

  return (
    <Stack space={2}>
      {whiteBackground && (
        <Box display="flex" justifyContent="flexEnd">
          <Button
            variant="text"
            icon={openFiltersToggle ? 'add' : 'remove'}
            size="small"
            onClick={() => {
              setExpandedItemIds(
                !openFiltersToggle ? [] : FILTER_ACCORDION_ITEM_IDS,
              )
              setOpenFiltersToggle(!openFiltersToggle)
            }}
          >
            {formatMessage(
              openFiltersToggle
                ? m.listPage.openAllFiltersLabel
                : m.listPage.closeAllFiltersLabel,
            )}
          </Button>
        </Box>
      )}
      <Box {...boxProps}>
        <Accordion
          singleExpand={false}
          dividerOnTop={false}
          dividerOnBottom={false}
        >
          <AccordionItem
            id={FILTER_ACCORDION_ITEM_IDS[0]}
            label={formatMessage(m.listPage.dateAccordionLabel)}
            expanded={expandedItemIds.includes(FILTER_ACCORDION_ITEM_IDS[0])}
            onToggle={(expanded) => {
              handleToggle(expanded, FILTER_ACCORDION_ITEM_IDS[0])
            }}
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
              <Stack space={2} key={renderKey}>
                <DebouncedDatePicker
                  debounceTimeInMs={DEBOUNCE_TIME_IN_MS}
                  name="from"
                  label={formatMessage(m.listPage.dateFromLabel)}
                  handleChange={(date) => {
                    updateQueryState(QueryParam.DATE_FROM, date)
                  }}
                  value={queryState[QueryParam.DATE_FROM]}
                  maxDate={queryState[QueryParam.DATE_TO]}
                />
                <DebouncedDatePicker
                  debounceTimeInMs={DEBOUNCE_TIME_IN_MS}
                  name="to"
                  label={formatMessage(m.listPage.dateToLabel)}
                  handleChange={(date) => {
                    updateQueryState(QueryParam.DATE_TO, date)
                  }}
                  value={queryState[QueryParam.DATE_TO]}
                  minDate={queryState[QueryParam.DATE_FROM]}
                />
              </Stack>
              <Box display="flex" justifyContent="flexEnd">
                <Button
                  variant="text"
                  icon="reload"
                  size="small"
                  onClick={() => {
                    updateQueryState(QueryParam.DATE_FROM, null)
                    updateQueryState(QueryParam.DATE_TO, null)
                    updateRenderKey()
                  }}
                >
                  {formatMessage(m.listPage.clearFilter)}
                </Button>
              </Box>
            </Stack>
          </AccordionItem>
          <AccordionItem
            id={FILTER_ACCORDION_ITEM_IDS[1]}
            label={formatMessage(m.listPage.lawyerAccordionLabel)}
            expanded={expandedItemIds.includes(FILTER_ACCORDION_ITEM_IDS[1])}
            onToggle={(expanded) => {
              handleToggle(expanded, FILTER_ACCORDION_ITEM_IDS[1])
            }}
            iconVariant="small"
            labelVariant="h5"
            labelColor={queryState[QueryParam.LAWYER] ? 'blue400' : undefined}
          >
            <Stack space={2}>
              <Stack space={2} key={renderKey}>
                <Select
                  name="lawyer"
                  options={lawyerOptions}
                  size="sm"
                  label={formatMessage(m.listPage.lawyerSelectLabel)}
                  value={lawyerOptions.find(
                    (option) => option.value === queryState[QueryParam.LAWYER],
                  )}
                  onChange={(option) => {
                    updateQueryState(QueryParam.LAWYER, option?.value ?? null)
                  }}
                />
              </Stack>
              <Box display="flex" justifyContent="flexEnd">
                <Button
                  variant="text"
                  icon="reload"
                  size="small"
                  onClick={() => {
                    updateQueryState(QueryParam.LAWYER, null)
                    updateRenderKey()
                  }}
                >
                  {formatMessage(m.listPage.clearFilter)}
                </Button>
              </Box>
            </Stack>
          </AccordionItem>
          <AccordionItem
            id={FILTER_ACCORDION_ITEM_IDS[2]}
            label={formatMessage(m.listPage.scheduleTypeAccordionLabel)}
            expanded={expandedItemIds.includes(FILTER_ACCORDION_ITEM_IDS[2])}
            onToggle={(expanded) => {
              handleToggle(expanded, FILTER_ACCORDION_ITEM_IDS[2])
            }}
            iconVariant="small"
            labelVariant="h5"
            labelColor={
              queryState[QueryParam.SCHEDULE_TYPES] ? 'blue400' : undefined
            }
          >
            <Stack space={2}>
              <Stack space={2} key={renderKey}>
                <Select
                  name="scheduleTypes"
                  options={scheduleTypesOptions}
                  size="sm"
                  label={formatMessage(m.listPage.scheduleTypeSelectLabel)}
                  value={scheduleTypesOptions.find(
                    (option) =>
                      queryState[QueryParam.SCHEDULE_TYPES] === option.value,
                  )}
                  onChange={(option) => {
                    updateQueryState(
                      QueryParam.SCHEDULE_TYPES,
                      option?.value ?? null,
                    )
                  }}
                />
              </Stack>
              <Box display="flex" justifyContent="flexEnd">
                <Button
                  variant="text"
                  icon="reload"
                  size="small"
                  onClick={() => {
                    updateQueryState(QueryParam.LAWYER, null)
                    updateQueryState(QueryParam.SCHEDULE_TYPES, null)
                    updateRenderKey()
                  }}
                >
                  {formatMessage(m.listPage.clearFilter)}
                </Button>
              </Box>
            </Stack>
          </AccordionItem>
        </Accordion>
      </Box>
    </Stack>
  )
}

const CourtAgendas: CustomScreen<CourtAgendasProps> = (props) => {
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
    renderKey,
    updateRenderKey,
  } = useCourtAgendasState(props)
  const { customPageData, lawyers } = props

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
        value: 'landsrettur',
      },
      {
        label: formatMessage(m.listPage.showSupremeCourt),
        value: 'Hæstiréttur',
      },
    ]
  }, [formatMessage])
  const districtCourtTags = useMemo(() => {
    return [...DISTRICT_COURT_TAGS]
  }, [])

  const districtCourtTagsForSelect = useMemo(() => {
    return [
      {
        label: formatMessage(m.listPage.showAllDistrictCourts),
        value: DEFAULT_DISTRICT_COURT_TAG,
      },
      ...DISTRICT_COURT_TAGS,
    ]
  }, [formatMessage])

  const districtCourtTagValues = districtCourtTags.map(({ value }) => value)

  const lawyerOptions = useMemo(() => {
    return lawyers.map((lawyer) => ({
      label: lawyer.name,
      value: lawyer.id,
    }))
  }, [lawyers])

  const scheduleTypesOptions = useMemo(
    () =>
      props.scheduleTypes.all.items.map((option) => ({
        label: option.label,
        value: option.label,
      })),
    [props.scheduleTypes.all.items],
  )

  const filterTags = useMemo(() => {
    const tags: { label: string; onClick: () => void }[] = []

    if (queryState[QueryParam.DATE_FROM]) {
      tags.push({
        label: `${formatMessage(m.listPage.dateFromLabel)}: ${format(
          queryState[QueryParam.DATE_FROM],
          'P',
        )}`,
        onClick: () => {
          updateQueryState(QueryParam.DATE_FROM, null)
          updateRenderKey()
        },
      })
    }

    if (queryState[QueryParam.DATE_TO]) {
      tags.push({
        label: `${formatMessage(m.listPage.dateToLabel)}: ${format(
          queryState[QueryParam.DATE_TO],
          'P',
        )}`,
        onClick: () => {
          updateQueryState(QueryParam.DATE_TO, null)
          updateRenderKey()
        },
      })
    }

    if (queryState[QueryParam.LAWYER]) {
      const lawyer = lawyerOptions.find(
        (option) => option.value === queryState[QueryParam.LAWYER],
      )
      tags.push({
        label: `${formatMessage(m.listPage.selectedLawyerPrefix)}: ${
          lawyer?.label ?? '...'
        }`,
        onClick: () => {
          updateQueryState(QueryParam.LAWYER, null)
          updateRenderKey()
        },
      })
    }

    if (queryState[QueryParam.SCHEDULE_TYPES]) {
      tags.push({
        label: `${formatMessage(m.listPage.scheduleTypeAccordionLabel)}: ${
          scheduleTypesOptions.find(
            (option) => option.value === queryState[QueryParam.SCHEDULE_TYPES],
          )?.label ?? '...'
        }`,
        onClick: () => {
          updateQueryState(QueryParam.SCHEDULE_TYPES, null)
          updateRenderKey()
        },
      })
    }

    return tags
  }, [
    queryState,
    formatMessage,
    format,
    updateQueryState,
    updateRenderKey,
    lawyerOptions,
    scheduleTypesOptions,
  ])

  return (
    <Box>
      <HeadWithSocialSharing title={customPageData?.ogTitle ?? heading}>
        {Boolean(customPageData?.configJson?.noIndex) && (
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
                <Hidden above="xs">
                  <Select
                    key={renderKey}
                    options={courtTags}
                    value={courtTags.find(
                      (tag) => tag.value === queryState[QueryParam.COURT],
                    )}
                    isSearchable={false}
                    label={formatMessage(m.listPage.courtSelectLabel)}
                    onChange={(option) => {
                      if (option) {
                        updateQueryState(QueryParam.COURT, option.value)
                        updateQueryState(QueryParam.DISTRICT_COURTS, null)
                      }
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
                            updateQueryState(QueryParam.DISTRICT_COURTS, null)
                          }}
                        >
                          {tag.label}
                        </Tag>
                      )
                    })}
                  </Inline>
                </Hidden>
                {(queryState[QueryParam.COURT] === DEFAULT_DISTRICT_COURT_TAG ||
                  (queryState[QueryParam.DISTRICT_COURTS]?.length ?? 0) >
                    0) && (
                  <>
                    <Hidden below="sm">
                      <Inline alignY="center" space={2}>
                        <Tag
                          key={DEFAULT_DISTRICT_COURT_TAG}
                          active={
                            queryState[QueryParam.COURT] ===
                              DEFAULT_DISTRICT_COURT_TAG &&
                            (queryState[QueryParam.DISTRICT_COURTS]?.length ??
                              0) === 0
                          }
                          onClick={() => {
                            if (
                              queryState[QueryParam.DISTRICT_COURTS].length > 0
                            ) {
                              updateQueryState(
                                QueryParam.COURT,
                                DEFAULT_DISTRICT_COURT_TAG,
                              )
                              updateQueryState(QueryParam.DISTRICT_COURTS, null)
                            }
                          }}
                        >
                          {formatMessage(m.listPage.showAllDistrictCourts)}
                        </Tag>
                        {districtCourtTags.map((tag) => {
                          const isActive =
                            (queryState[QueryParam.COURT] === tag.value &&
                              tag.value === DEFAULT_DISTRICT_COURT_TAG) ||
                            (queryState[QueryParam.DISTRICT_COURTS].includes(
                              tag.value,
                            ) &&
                              tag.value !== DEFAULT_DISTRICT_COURT_TAG)
                          return (
                            <Tag
                              key={tag.value}
                              active={isActive}
                              onClick={() => {
                                updateQueryState(
                                  QueryParam.DISTRICT_COURTS,
                                  (previousState) => {
                                    const previousDistrictCourts =
                                      previousState[QueryParam.DISTRICT_COURTS]

                                    if (
                                      previousDistrictCourts.some(
                                        (districtCourt) =>
                                          districtCourt === tag.value,
                                      )
                                    ) {
                                      const updatedDistrictCourts =
                                        previousDistrictCourts.filter(
                                          (districtCourt) =>
                                            districtCourt !== tag.value,
                                        )

                                      return {
                                        ...previousState,
                                        [QueryParam.DISTRICT_COURTS]:
                                          updatedDistrictCourts.length > 0
                                            ? updatedDistrictCourts
                                            : [],
                                      }
                                    }

                                    return {
                                      ...previousState,
                                      [QueryParam.DISTRICT_COURTS]:
                                        previousDistrictCourts.concat(
                                          tag.value,
                                        ),
                                    }
                                  },
                                )
                              }}
                            >
                              <Box
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {tag.label}
                                {isActive && (
                                  <span
                                    className={styles.crossmark}
                                    aria-hidden="true"
                                  >
                                    &#10005;
                                  </span>
                                )}
                              </Box>
                            </Tag>
                          )
                        })}
                      </Inline>
                    </Hidden>
                    <Hidden above="xs">
                      <Select
                        key={renderKey}
                        options={districtCourtTagsForSelect}
                        label={formatMessage(
                          m.listPage.districtCourtSelectLabel,
                        )}
                        isSearchable={false}
                        isClearable={false}
                        value={districtCourtTagsForSelect.filter((tag) => {
                          if (
                            queryState[QueryParam.DISTRICT_COURTS]?.length > 0
                          ) {
                            return queryState[
                              QueryParam.DISTRICT_COURTS
                            ]?.includes(tag.value)
                          } else {
                            return (
                              queryState[QueryParam.COURT] ===
                                DEFAULT_DISTRICT_COURT_TAG &&
                              tag.value === DEFAULT_DISTRICT_COURT_TAG
                            )
                          }
                        })}
                        onChange={(options) => {
                          if (options.length === 0) {
                            updateQueryState(QueryParam.COURT, ALL_COURTS_TAG)
                            updateQueryState(QueryParam.DISTRICT_COURTS, null)
                            return
                          }
                          if (
                            options[options.length - 1]?.value ===
                            DEFAULT_DISTRICT_COURT_TAG
                          ) {
                            updateQueryState(
                              QueryParam.COURT,
                              DEFAULT_DISTRICT_COURT_TAG,
                            )
                            updateQueryState(QueryParam.DISTRICT_COURTS, null)
                          } else {
                            updateQueryState(
                              QueryParam.DISTRICT_COURTS,
                              options
                                .map((option) => option.value)
                                .filter(
                                  (value) =>
                                    value !== DEFAULT_DISTRICT_COURT_TAG,
                                ),
                            )
                          }
                        }}
                        size="sm"
                        backgroundColor="blue"
                        isMulti={true}
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
          className={cn(styles.mainContainer, 'rs_read')}
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
                <Filters
                  renderKey={renderKey}
                  startExpanded={true}
                  queryState={queryState}
                  updateQueryState={updateQueryState}
                  updateRenderKey={updateRenderKey}
                  whiteBackground={true}
                  lawyerOptions={lawyerOptions}
                  scheduleTypesOptions={scheduleTypesOptions}
                />
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
              {filterTags.length > 0 && (
                <Inline alignY="center" space={1}>
                  {filterTags.map((tag) => (
                    <FilterTag
                      key={tag.label}
                      variant="darkerBlue"
                      onClick={tag.onClick}
                    >
                      {tag.label}
                    </FilterTag>
                  ))}
                </Inline>
              )}
              <Inline justifyContent="spaceBetween" alignY="center" space={2}>
                <Text>
                  <strong>{data.total}</strong>{' '}
                  {formatMessage(
                    m.listPage[
                      data.total === 1
                        ? 'courtAgendasFoundSingular'
                        : 'courtAgendasFoundPlural'
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
                        startExpanded={true}
                        renderKey={renderKey}
                        updateRenderKey={updateRenderKey}
                        queryState={queryState}
                        updateQueryState={updateQueryState}
                        lawyerOptions={lawyerOptions}
                        scheduleTypesOptions={scheduleTypesOptions}
                      />
                    </Box>
                  </Filter>
                </Hidden>
              </Inline>
              {data.visibleCourtAgendas.map((agenda) => {
                let time = ''
                if (agenda.dateFrom && agenda.dateTo) {
                  time = `${format(
                    new Date(agenda.dateFrom),
                    'HH:mm',
                  )}${formatMessage(m.listPage.timeSeparator)}${format(
                    new Date(agenda.dateTo),
                    'HH:mm',
                  )}`
                } else if (agenda.dateFrom) {
                  time = format(new Date(agenda.dateFrom), 'HH:mm')
                }

                let description = ''

                if (agenda.caseNumber) {
                  description += agenda.caseNumber + '\n\n'
                }

                if (agenda.court) {
                  description += agenda.court + '\n\n'
                }

                if (agenda.courtRoom) {
                  description += agenda.courtRoom + '\n\n'
                }

                if (time) {
                  description += time + '\n\n'
                }

                if (agenda.closedHearing) {
                  description +=
                    (agenda.closedHearing
                      ? formatMessage(m.listPage.closedHearing)
                      : '') + '\n\n'
                }

                return (
                  <AgendaCard
                    key={agenda.id}
                    caseNumber={agenda.caseNumber}
                    type={agenda.type}
                    judgesString={
                      agenda.judges.length > 0
                        ? `${formatMessage(
                            m.listPage[
                              agenda.judges.length === 1
                                ? 'judgesSingularPrefix'
                                : 'judgesPluralPrefix'
                            ],
                          )}: ${agenda.judges
                            .map((judge) => judge.name)
                            .join(', ')}`
                        : ''
                    }
                    title={agenda.title}
                    closedHearingText={
                      agenda.closedHearing
                        ? formatMessage(m.listPage.closedHearing)
                        : ''
                    }
                    date={
                      agenda.dateFrom
                        ? format(new Date(agenda.dateFrom), 'd. MMMM yyyy')
                        : ''
                    }
                    time={time}
                    court={agenda.court}
                    courtRoom={agenda.courtRoom}
                    addToCalendarButton={
                      agenda.dateFrom ? (
                        <AddToCalendarButton
                          event={{
                            title: agenda.title,
                            description,
                            location: [agenda.court, agenda.courtRoom]
                              .filter(Boolean)
                              .join(' - '),
                            startDate: format(
                              new Date(agenda.dateFrom),
                              'yyyy-MM-dd',
                            ),
                            startTime: format(
                              new Date(agenda.dateFrom),
                              'HH:mm',
                            ),
                            endTime: agenda.dateTo
                              ? format(new Date(agenda.dateTo), 'HH:mm')
                              : undefined,
                          }}
                        />
                      ) : null
                    }
                  />
                )
              })}
              {total > data.visibleCourtAgendas.length && (
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
                    {formatMessage(m.listPage.seeMoreCourtAgendas, {
                      remainingCourtAgendasCount:
                        total - data.visibleCourtAgendas.length,
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

CourtAgendas.getProps = async ({ apolloClient, customPageData, query }) => {
  if (customPageData?.configJson?.showCourtAgendasPage === false) {
    throw new CustomNextError(
      404,
      'Court agendas page has been turned off in the CMS',
    )
  }

  const court = parseAsString.parseServerSide(query[QueryParam.COURT])
  const districtCourts =
    parseAsArrayOf(parseAsString).parseServerSide(
      query[QueryParam.DISTRICT_COURTS],
    ) ?? []
  const dateFrom = parseAsString.parseServerSide(query[QueryParam.DATE_FROM])
  const dateTo = parseAsString.parseServerSide(query[QueryParam.DATE_TO])
  const lawyer = parseAsString.parseServerSide(query[QueryParam.LAWYER])

  const [courtAgendasResponse, lawyersResponse, scheduleTypesResponse] =
    await Promise.all([
      apolloClient.query<GetCourtAgendasQuery, GetCourtAgendasQueryVariables>({
        query: GET_COURT_AGENDAS_QUERY,
        variables: {
          input: {
            page: 1,
            court:
              districtCourts.length > 0
                ? districtCourts.join(',')
                : extractCourtLevelFromState(court),
            dateFrom,
            dateTo,
            lawyer,
          },
        },
      }),
      apolloClient.query<
        GetVerdictLawyersQuery,
        GetVerdictLawyersQueryVariables
      >({
        query: GET_VERDICT_LAWYERS_QUERY,
      }),
      apolloClient.query<GetScheduleTypesQuery, GetScheduleTypesQueryVariables>(
        {
          query: GET_SCHEDULE_TYPES_QUERY,
        },
      ),
    ])

  const items = courtAgendasResponse.data.webCourtAgendas.items

  return {
    initialData: {
      visibleCourtAgendas: items.slice(0, ITEMS_PER_PAGE),
      invisibleCourtAgendas: items.slice(ITEMS_PER_PAGE),
      total: courtAgendasResponse.data.webCourtAgendas.total,
    },
    lawyers: lawyersResponse.data.webVerdictLawyers?.lawyers ?? [],
    scheduleTypes: scheduleTypesResponse.data.webCourtScheduleTypes,
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.CourtAgendas, CourtAgendas),
  {
    footerVersion: 'organization',
  },
)
