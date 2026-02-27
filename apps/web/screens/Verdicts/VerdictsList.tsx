import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useDebounce } from 'react-use'
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
  type IconMapIcon,
  Inline,
  Select,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import {
  FilterTag,
  HeadWithSocialSharing,
  Webreader,
} from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  type GetVerdictCaseFilterOptionsPerCourtQuery,
  type GetVerdictCaseFilterOptionsPerCourtQueryVariables,
  type GetVerdictKeywordsQuery,
  type GetVerdictKeywordsQueryVariables,
  type GetVerdictsQuery,
  type GetVerdictsQueryVariables,
  WebVerdictCaseFilterOptionType,
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
  GET_VERDICT_CASE_FILTER_OPTIONS_PER_COURT_QUERY,
  GET_VERDICT_KEYWORDS_QUERY,
  GET_VERDICTS_QUERY,
} from '../queries/Verdicts'
import { DebouncedCheckbox } from './components/DebouncedCheckbox'
import { DebouncedDatePicker } from './components/DebouncedDatePicker'
import { DebouncedInput } from './components/DebouncedInput'
import { InfoCardGrid } from './components/InfoCardGrid/InfoCardGrid'
import { m } from './translations.strings'
import * as styles from './VerdictsList.css'

const ITEMS_PER_PAGE = 10
const DEBOUNCE_TIME_IN_MS = 500
const DATE_FORMAT = 'd. MMMM yyyy'

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

const mapCourtToTopLevelCourt = (
  court: string,
): 'all' | 'courtOfAppeal' | 'supremeCourt' | 'districtCourt' => {
  if (!court || court === ALL_COURTS_TAG) return 'all'
  if (court === DEFAULT_DISTRICT_COURT_TAG || court.startsWith('hd-'))
    return 'districtCourt'
  if (court === 'Hæstiréttur') return 'supremeCourt'
  if (court === 'landsrettur') return 'courtOfAppeal'
  return 'all'
}

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
  CASE_CONTACT = 'caseContact',
  DISTRICT_COURTS = 'districtCourts',
}

interface VerdictsListProps {
  initialData: {
    visibleVerdicts: GetVerdictsQuery['webVerdicts']['items']
    invisibleVerdicts: GetVerdictsQuery['webVerdicts']['items']
    total: number
  }
  keywords: WebVerdictKeyword[]
  caseFilterOptions: GetVerdictCaseFilterOptionsPerCourtQuery['webVerdictCaseFilterOptionsPerCourt']
  showRetrialCourtOption: boolean
  retrialCourtOptionValue: string
}

const normalizeLawReference = (input: string): string => {
  const trimmed = input
    .replace(/\./g, '') // remove dots
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .toLowerCase()
    .trim()

  let year = ''
  let lawNo = ''
  let gr = ''
  let mgr = ''

  const parts = trimmed.split(' ')

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]

    if (part === 'mgr') {
      // Previous part is the mgr number
      if (i > 0 && /^\d+$/.test(parts[i - 1])) {
        mgr = parts[i - 1]
      }
    }
    if (part === 'gr') {
      // Previous part is the gr number
      if (i > 0 && /^\d+$/.test(parts[i - 1])) {
        gr = parts[i - 1]
      }
    }
    if (part === 'nr') {
      // Next part is lawNo/year
      if (i + 1 < parts.length && parts[i + 1].includes('/')) {
        const lawParts = parts[i + 1].split('/')
        if (lawParts.length === 2) {
          lawNo = lawParts[0]
          year = lawParts[1]
        }
      }
    }
    // As fallback: detect bare lawNo/year like "91/1991"
    if (!lawNo && part.includes('/')) {
      const lawParts = part.split('/')
      if (
        lawParts.length === 2 &&
        /^\d+$/.test(lawParts[0]) &&
        /^\d{4}$/.test(lawParts[1])
      ) {
        lawNo = lawParts[0]
        year = lawParts[1]
      }
    }
  }

  if (!year || !lawNo) {
    return input
  }

  let result = `${year}.${lawNo}`
  if (gr) result += `.${gr}`
  if (mgr) result += `.${mgr}`

  return result
}

const extractCourtLevelFromState = (court: string | null | undefined) => {
  if (court === DEFAULT_DISTRICT_COURT_TAG) {
    return DISTRICT_COURT_TAGS.map((tag) => tag.value).join(',')
  }
  return court || ALL_COURTS_TAG
}

const useVerdictListState = (props: VerdictsListProps) => {
  const initialRender = useRef(true)
  const [renderKey, setRenderKey] = useState(1)
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
      [QueryParam.DISTRICT_COURTS]: parseAsArrayOf(parseAsString)
        .withOptions({ clearOnDefault: true })
        .withDefault([]),
      [QueryParam.KEYWORD]: parseAsString
        .withOptions({ clearOnDefault: true })
        .withDefault(''),
      [QueryParam.CASE_CONTACT]: parseAsString
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
      const laws = normalizeLawReference(queryParams[QueryParam.LAWS])
      return {
        page,
        searchTerm: queryParams[QueryParam.SEARCH_TERM],
        courtLevel:
          queryParams[QueryParam.DISTRICT_COURTS]?.length > 0
            ? queryParams[QueryParam.DISTRICT_COURTS].join(',')
            : extractCourtLevelFromState(queryParams[QueryParam.COURT]),
        caseNumber: queryParams[QueryParam.CASE_NUMBER],
        keywords: keyword ? [keyword] : null,
        caseCategories: queryParams[QueryParam.CASE_CATEGORIES],
        caseTypes: queryParams[QueryParam.CASE_TYPES],
        laws: laws ? [laws] : null,
        dateFrom: queryParams[QueryParam.DATE_FROM]?.toISOString() ?? null,
        dateTo: queryParams[QueryParam.DATE_TO]?.toISOString() ?? null,
        caseContact: queryParams[QueryParam.CASE_CONTACT] ?? null,
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

interface KeywordSelectProps {
  keywordOptions: {
    label: string
    value: string
  }[]
  value: { label: string; value: string } | undefined
  onChange: (_: { label: string; value: string } | undefined) => void
  clearStateButtonText?: string
}

const KeywordSelect = ({
  keywordOptions,
  value,
  onChange,
  clearStateButtonText,
}: KeywordSelectProps) => {
  const { formatMessage } = useIntl()
  const [state, setState] = useState(value)
  const initialRender = useRef(true)
  const [renderKey, setRenderKey] = useState(0)

  useDebounce(
    () => {
      if (initialRender.current) {
        initialRender.current = false
        return
      }
      onChange(state)
    },
    DEBOUNCE_TIME_IN_MS,
    [state],
  )
  return (
    <Stack space={2}>
      <Select
        key={renderKey}
        size="sm"
        options={keywordOptions}
        value={state}
        onChange={(option) => {
          if (option) setState(option)
        }}
        placeholder={formatMessage(m.listPage.keywordSelectPlaceholder)}
      />
      {Boolean(clearStateButtonText) && (
        <Box display="flex" justifyContent="flexEnd">
          <Button
            variant="text"
            icon="reload"
            size="small"
            onClick={() => {
              setState(undefined)
              setRenderKey((key) => key + 1)
            }}
          >
            {formatMessage(m.listPage.clearFilter)}
          </Button>
        </Box>
      )}
    </Stack>
  )
}

const FILTER_ACCORDION_ITEM_IDS = [
  'case-number-accordion',
  'laws-accordion',
  'keywords-accordion',
  'case-contact-accordion',
  'case-filter-options-accordion',
  'date-accordion',
]

interface FiltersProps {
  startExpanded?: boolean
  queryState: ReturnType<typeof useVerdictListState>['queryState']
  updateQueryState: ReturnType<typeof useVerdictListState>['updateQueryState']
  keywords: VerdictsListProps['keywords']
  caseFilterOptions: VerdictsListProps['caseFilterOptions']
  renderKey: string | number
  updateRenderKey: () => void
  whiteBackground?: boolean
  selectedCourtLevel: 'all' | 'courtOfAppeal' | 'supremeCourt' | 'districtCourt'
}

const Filters = ({
  startExpanded = false,
  queryState,
  keywords,
  caseFilterOptions,
  updateQueryState,
  renderKey,
  updateRenderKey,
  whiteBackground = false,
  selectedCourtLevel,
}: FiltersProps) => {
  const { formatMessage } = useIntl()
  const [expandedItemIds, setExpandedItemIds] = useState<string[]>(
    startExpanded ? FILTER_ACCORDION_ITEM_IDS : [],
  )
  const [openFiltersToggle, setOpenFiltersToggle] = useState(!startExpanded)

  const keywordOptions = useMemo(() => {
    return keywords.map((keyword) => ({
      label: keyword.label,
      value: keyword.label,
    }))
  }, [keywords])

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
            label={formatMessage(m.listPage.caseNumberAccordionLabel)}
            expanded={expandedItemIds.includes(FILTER_ACCORDION_ITEM_IDS[0])}
            onToggle={(expanded) => {
              handleToggle(expanded, FILTER_ACCORDION_ITEM_IDS[0])
            }}
            iconVariant="small"
            labelVariant="h5"
            labelColor={
              queryState[QueryParam.CASE_NUMBER] ? 'blue400' : undefined
            }
          >
            <DebouncedInput
              key={renderKey}
              value={queryState[QueryParam.CASE_NUMBER]}
              onChange={(value) => {
                updateQueryState(QueryParam.CASE_NUMBER, value)
              }}
              label={formatMessage(m.listPage.caseNumberInputLabel)}
              name="casenumber-input"
              debounceTimeInMs={DEBOUNCE_TIME_IN_MS}
              clearStateButtonText={formatMessage(m.listPage.clearFilter)}
            />
          </AccordionItem>

          <AccordionItem
            id={FILTER_ACCORDION_ITEM_IDS[1]}
            label={formatMessage(m.listPage.lawsAccordionLabel)}
            expanded={expandedItemIds.includes(FILTER_ACCORDION_ITEM_IDS[1])}
            onToggle={(expanded) => {
              handleToggle(expanded, FILTER_ACCORDION_ITEM_IDS[1])
            }}
            iconVariant="small"
            labelVariant="h5"
            labelColor={queryState[QueryParam.LAWS] ? 'blue400' : undefined}
          >
            <Stack space={2}>
              <DebouncedInput
                key={renderKey}
                label={formatMessage(m.listPage.lawsInputLabel)}
                name="laws-input"
                onChange={(value) => {
                  updateQueryState(QueryParam.LAWS, value)
                }}
                value={queryState[QueryParam.LAWS]}
                debounceTimeInMs={DEBOUNCE_TIME_IN_MS}
                clearStateButtonText={formatMessage(m.listPage.clearFilter)}
              />
            </Stack>
          </AccordionItem>

          <AccordionItem
            id={FILTER_ACCORDION_ITEM_IDS[2]}
            label={formatMessage(m.listPage.keywordAccordionLabel)}
            expanded={expandedItemIds.includes(FILTER_ACCORDION_ITEM_IDS[2])}
            onToggle={(expanded) => {
              handleToggle(expanded, FILTER_ACCORDION_ITEM_IDS[2])
            }}
            iconVariant="small"
            labelVariant="h5"
            labelColor={queryState[QueryParam.KEYWORD] ? 'blue400' : undefined}
          >
            <KeywordSelect
              key={renderKey}
              keywordOptions={keywordOptions}
              value={keywordOptions.find(
                (option) => option.value === queryState[QueryParam.KEYWORD],
              )}
              onChange={(option) => {
                updateQueryState(QueryParam.KEYWORD, option?.value ?? null)
              }}
              clearStateButtonText={formatMessage(m.listPage.clearFilter)}
            />
          </AccordionItem>

          <AccordionItem
            id={FILTER_ACCORDION_ITEM_IDS[3]}
            label={formatMessage(m.listPage.caseContactAccordionLabel)}
            expanded={expandedItemIds.includes(FILTER_ACCORDION_ITEM_IDS[3])}
            onToggle={(expanded) => {
              handleToggle(expanded, FILTER_ACCORDION_ITEM_IDS[3])
            }}
            iconVariant="small"
            labelVariant="h5"
            labelColor={
              queryState[QueryParam.CASE_CONTACT] ? 'blue400' : undefined
            }
          >
            <DebouncedInput
              key={renderKey}
              value={queryState[QueryParam.CASE_CONTACT]}
              onChange={(value) => {
                updateQueryState(QueryParam.CASE_CONTACT, value)
              }}
              label={formatMessage(m.listPage.caseContactInputLabel)}
              name="casecontact-input"
              debounceTimeInMs={DEBOUNCE_TIME_IN_MS}
              clearStateButtonText={formatMessage(m.listPage.clearFilter)}
            />
          </AccordionItem>

          <AccordionItem
            id={FILTER_ACCORDION_ITEM_IDS[4]}
            label={formatMessage(m.listPage.caseTypeAccordionLabel)}
            expanded={expandedItemIds.includes(FILTER_ACCORDION_ITEM_IDS[4])}
            onToggle={(expanded) => {
              handleToggle(expanded, FILTER_ACCORDION_ITEM_IDS[4])
            }}
            iconVariant="small"
            labelVariant="h5"
            labelColor={
              queryState[QueryParam.CASE_TYPES] ||
              queryState[QueryParam.CASE_CATEGORIES]
                ? 'blue400'
                : undefined
            }
          >
            <Stack space={2}>
              <Stack space={2} key={renderKey}>
                {caseFilterOptions[selectedCourtLevel].options.map(
                  ({ label, typeOfOption }) => {
                    const queryParamKey =
                      typeOfOption ===
                      WebVerdictCaseFilterOptionType.CaseCategory
                        ? QueryParam.CASE_CATEGORIES
                        : QueryParam.CASE_TYPES
                    return (
                      <DebouncedCheckbox
                        debounceTimeInMs={DEBOUNCE_TIME_IN_MS}
                        key={label}
                        checked={Boolean(
                          queryState[queryParamKey]?.includes(label),
                        )}
                        label={label}
                        value={label}
                        onChange={(checked) => {
                          updateQueryState(queryParamKey, (previousState) => {
                            let updatedValues = [
                              ...(previousState[queryParamKey] ?? []),
                            ]
                            if (checked) {
                              updatedValues.push(label)
                            } else {
                              updatedValues = updatedValues.filter(
                                (value) => value !== label,
                              )
                            }
                            return {
                              ...previousState,
                              [queryParamKey]:
                                updatedValues.length === 0
                                  ? null
                                  : updatedValues,
                            }
                          })
                        }}
                      />
                    )
                  },
                )}
              </Stack>
              <Box display="flex" justifyContent="flexEnd">
                <Button
                  variant="text"
                  icon="reload"
                  size="small"
                  onClick={() => {
                    updateQueryState(QueryParam.CASE_TYPES, [])
                    updateRenderKey()
                  }}
                >
                  {formatMessage(m.listPage.clearFilter)}
                </Button>
              </Box>
            </Stack>
          </AccordionItem>

          <AccordionItem
            id={FILTER_ACCORDION_ITEM_IDS[5]}
            label={formatMessage(m.listPage.dateAccordionLabel)}
            expanded={expandedItemIds.includes(FILTER_ACCORDION_ITEM_IDS[5])}
            onToggle={(expanded) => {
              handleToggle(expanded, FILTER_ACCORDION_ITEM_IDS[5])
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
        </Accordion>
      </Box>
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
    renderKey,
    updateRenderKey,
  } = useVerdictListState(props)
  const {
    customPageData,
    keywords,
    showRetrialCourtOption,
    retrialCourtOptionValue,
    caseFilterOptions,
  } = props

  const { format } = useDateUtils()
  const { formatMessage } = useIntl()

  const heading = formatMessage(m.listPage.heading)

  const courtTags = useMemo(() => {
    const tags = [
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

    if (showRetrialCourtOption) {
      tags.push({
        label: formatMessage(m.listPage.showRetrialCourt),
        value: retrialCourtOptionValue,
      })
    }

    return tags
  }, [formatMessage, showRetrialCourtOption, retrialCourtOptionValue])

  const filterTags = useMemo(() => {
    const tags: { label: string; onClick: () => void }[] = []
    if (queryState[QueryParam.CASE_NUMBER]) {
      tags.push({
        label: `${formatMessage(m.listPage.caseNumberAccordionLabel)}: ${
          queryState[QueryParam.CASE_NUMBER]
        }`,
        onClick: () => {
          updateQueryState(QueryParam.CASE_NUMBER, '')
          updateRenderKey()
        },
      })
    }

    if (queryState[QueryParam.LAWS]) {
      tags.push({
        label: `${formatMessage(m.listPage.lawsAccordionLabel)}: ${
          queryState[QueryParam.LAWS]
        }`,
        onClick: () => {
          updateQueryState(QueryParam.LAWS, '')
          updateRenderKey()
        },
      })
    }

    if (queryState[QueryParam.KEYWORD]) {
      tags.push({
        label: `${formatMessage(m.listPage.keywordAccordionLabel)}: ${
          queryState[QueryParam.KEYWORD]
        }`,
        onClick: () => {
          updateQueryState(QueryParam.KEYWORD, null)
          updateRenderKey()
        },
      })
    }

    if (queryState[QueryParam.CASE_CONTACT]) {
      tags.push({
        label: `${formatMessage(m.listPage.caseContactAccordionLabel)}: ${
          queryState[QueryParam.CASE_CONTACT]
        }`,
        onClick: () => {
          updateQueryState(QueryParam.CASE_CONTACT, '')
          updateRenderKey()
        },
      })
    }

    if (queryState[QueryParam.CASE_CATEGORIES]) {
      if (queryState[QueryParam.CASE_CATEGORIES].length > 0) {
        for (const category of queryState[QueryParam.CASE_CATEGORIES]) {
          tags.push({
            label: `${formatMessage(
              m.listPage.caseTypeAccordionLabel,
            )}: ${category}`,
            onClick: () => {
              updateQueryState(QueryParam.CASE_CATEGORIES, (previousState) => {
                let previousCategories =
                  previousState[QueryParam.CASE_CATEGORIES]
                if (previousCategories) {
                  previousCategories = previousCategories.filter(
                    (previousCategory) => previousCategory !== category,
                  )
                  if (previousCategories.length === 0) {
                    previousCategories = null
                  }
                }
                return {
                  ...previousState,
                  [QueryParam.CASE_CATEGORIES]: previousCategories,
                }
              })
              updateRenderKey()
            },
          })
        }
      }
    }

    if (queryState[QueryParam.CASE_TYPES]) {
      if (queryState[QueryParam.CASE_TYPES].length > 0) {
        for (const caseType of queryState[QueryParam.CASE_TYPES]) {
          tags.push({
            label: `${formatMessage(
              m.listPage.caseTypeAccordionLabel,
            )}: ${caseType}`,
            onClick: () => {
              updateQueryState(QueryParam.CASE_TYPES, (previousState) => {
                let previousCaseTypes = previousState[QueryParam.CASE_TYPES]
                if (previousCaseTypes) {
                  previousCaseTypes = previousCaseTypes.filter(
                    (previousCaseType) => previousCaseType !== caseType,
                  )
                  if (previousCaseTypes.length === 0) {
                    previousCaseTypes = null
                  }
                }
                return {
                  ...previousState,
                  [QueryParam.CASE_TYPES]: previousCaseTypes,
                }
              })
              updateRenderKey()
            },
          })
        }
      }
    }

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

    return tags
  }, [format, formatMessage, queryState, updateQueryState, updateRenderKey])

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

  return (
    <Box>
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
                  <DebouncedInput
                    debounceTimeInMs={DEBOUNCE_TIME_IN_MS}
                    key={renderKey}
                    value={queryState[QueryParam.SEARCH_TERM]}
                    loading={loading}
                    onChange={(value) => {
                      updateQueryState(QueryParam.SEARCH_TERM, value)
                    }}
                    name="verdict-search-input"
                    icon={{ name: 'search', type: 'outline' }}
                    backgroundColor="blue"
                    placeholder={formatMessage(
                      m.listPage.searchInputPlaceholder,
                    )}
                    size="md"
                  />
                </Box>
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
                        const topLevel = mapCourtToTopLevelCourt(option.value)
                        const previousTopLevel = mapCourtToTopLevelCourt(
                          queryState[QueryParam.COURT],
                        )
                        if (
                          topLevel !== previousTopLevel &&
                          topLevel !== 'all'
                        ) {
                          updateQueryState(QueryParam.CASE_CATEGORIES, null)
                          updateQueryState(QueryParam.CASE_TYPES, null)
                          updateRenderKey()
                        }

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
                            const topLevel = mapCourtToTopLevelCourt(tag.value)
                            const previousTopLevel = mapCourtToTopLevelCourt(
                              queryState[QueryParam.COURT],
                            )
                            if (
                              topLevel !== previousTopLevel &&
                              topLevel !== 'all'
                            ) {
                              updateQueryState(QueryParam.CASE_CATEGORIES, null)
                              updateQueryState(QueryParam.CASE_TYPES, null)
                              updateRenderKey()
                            }
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
                  selectedCourtLevel={mapCourtToTopLevelCourt(
                    queryState[QueryParam.COURT],
                  )}
                  renderKey={renderKey}
                  startExpanded={true}
                  caseFilterOptions={caseFilterOptions}
                  keywords={keywords}
                  queryState={queryState}
                  updateQueryState={updateQueryState}
                  updateRenderKey={updateRenderKey}
                  whiteBackground={true}
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
                        selectedCourtLevel={mapCourtToTopLevelCourt(
                          queryState[QueryParam.COURT],
                        )}
                        renderKey={renderKey}
                        updateRenderKey={updateRenderKey}
                        caseFilterOptions={caseFilterOptions}
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
                    const detailLines: {
                      icon: IconMapIcon
                      text: string | React.ReactNode
                    }[] = [
                      {
                        icon: 'calendar',
                        text: verdict.verdictDate
                          ? format(new Date(verdict.verdictDate), DATE_FORMAT)
                          : '',
                      },
                      { icon: 'hammer', text: verdict.court ?? '' },
                    ]

                    if (verdict.verdictJudges?.length) {
                      detailLines.push({
                        icon: 'person',
                        text: (
                          <Stack space={1}>
                            {verdict.verdictJudges.map((judge, index) => {
                              const judgeName = judge?.name ?? ''
                              if (!judgeName) return null
                              let judgeTitle = judge?.title ?? ''
                              if (judgeName === judgeTitle) judgeTitle = ''
                              return (
                                <Text key={index} variant="small">
                                  {judgeName} {judgeTitle}
                                </Text>
                              )
                            })}
                          </Stack>
                        ),
                      })
                    }

                    return {
                      description: verdict.title,
                      eyebrow: '',
                      id: verdict.id,
                      link: { href: `/domar/${verdict.id}`, label: '' },
                      title: verdict.caseNumber,
                      subDescription: verdict.keywords.join(', '),
                      borderColor: 'blue200',
                      detailLines,
                      revealMoreButtonProps: {
                        revealLabel: formatMessage(m.listPage.revealMoreLabel),
                        hideLabel: formatMessage(m.listPage.hideMoreLabel),
                        revealedText: verdict.presentings,
                      },
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
  if (!customPageData?.configJson?.showVerdictListPage) {
    throw new CustomNextError(
      404,
      'Verdict list page has been turned off in the CMS',
    )
  }

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
  const caseContact = parseAsString.parseServerSide(
    query[QueryParam.CASE_CONTACT],
  )
  const districtCourts =
    parseAsArrayOf(parseAsString).parseServerSide(
      query[QueryParam.DISTRICT_COURTS],
    ) ?? []

  const [
    verdictListResponse,
    caseFilterOptionsPerCourtResponse,
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
          courtLevel:
            districtCourts.length > 0
              ? districtCourts.join(',')
              : extractCourtLevelFromState(court),
          laws: laws?.map(normalizeLawReference),
          caseNumber,
          dateFrom,
          dateTo,
          caseContact,
        },
      },
    }),
    apolloClient.query<
      GetVerdictCaseFilterOptionsPerCourtQuery,
      GetVerdictCaseFilterOptionsPerCourtQueryVariables
    >({
      query: GET_VERDICT_CASE_FILTER_OPTIONS_PER_COURT_QUERY,
    }),
    apolloClient.query<
      GetVerdictKeywordsQuery,
      GetVerdictKeywordsQueryVariables
    >({
      query: GET_VERDICT_KEYWORDS_QUERY,
    }),
  ])

  const items = verdictListResponse.data.webVerdicts.items

  return {
    initialData: {
      visibleVerdicts: items.slice(0, ITEMS_PER_PAGE),
      invisibleVerdicts: items.slice(ITEMS_PER_PAGE),
      total: verdictListResponse.data.webVerdicts.total,
    },
    caseFilterOptions:
      caseFilterOptionsPerCourtResponse.data
        .webVerdictCaseFilterOptionsPerCourt,
    keywords: keywordsResponse.data.webVerdictKeywords.keywords,
    showRetrialCourtOption:
      customPageData?.configJson?.showRetrialCourtOption ?? false,
    retrialCourtOptionValue:
      customPageData?.configJson?.retrialCourtOptionValue ??
      'Endurupptökudómur',
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Verdicts, VerdictsList),
  {
    footerVersion: 'organization',
  },
)
