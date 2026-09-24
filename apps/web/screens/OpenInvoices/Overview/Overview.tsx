import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  OnChangeFn,
  Pagination,
  SortingState,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { CustomPageUniqueIdentifier, Locale } from '@island.is/shared/types'
import {
  formatCurrency,
  formatCurrencyWithoutSuffix,
  isDefined,
} from '@island.is/shared/utils'
import { MarkdownText } from '@island.is/web/components'
import {
  IcelandicGovernmentInstitutionsInvoicePaymentsGroup,
  IcelandicGovernmentInstitutionsInvoicePaymentsGroups,
  IcelandicGovernmentInstitutionsOpenInvoiceSortField,
  IcelandicGovernmentInstitutionsSortDirection,
  Organization,
  Query,
  QueryGetOrganizationArgs,
  QueryIcelandicGovernmentInstitutionsInvoicePaymentsGroupsArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver, useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextRedirect } from '@island.is/web/units/errors'

import { CustomScreen, withCustomPageWrapper } from '../../CustomPage'
import SidebarLayout from '../../Layouts/SidebarLayout'
import { GET_ORGANIZATION_QUERY } from '../../queries'
import {
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_DEBTORS,
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_GROUPS,
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_MINISTRIES,
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_SUPPLIERS,
} from '../../queries/OpenInvoices'
import { OpenInvoicesWrapper } from '../components/OpenInvoicesWrapper'
import { OverviewFilter } from '../components/OverviewFilter'
import { MAX_DATE_RANGE_DAYS, ORGANIZATION_SLUG } from '../constants'
import {
  extractDebtors,
  extractMinistries,
  extractSuppliers,
  mapDebtor,
  mapMinistry,
  mapSupplier,
} from '../hooks/asyncFilterSources'
import { useAsyncFilterSource } from '../hooks/useAsyncFilterSource'
import { useInvoicePaymentTypeGroupFilter } from '../hooks/useInvoicePaymentTypeGroupFilter'
import { m } from '../messages'
import { OverviewTable } from './OverviewTable'
import * as styles from './Overview.css'

const PAGE_SIZE = 12

/** Shared by the client URL state and the SSR fetch in `getProps` — the two must not drift. */
const SORT_IDS = ['supplier', 'customer', 'totalPaymentsSum'] as const
const SORT_DIRECTIONS = ['asc', 'desc'] as const

type SortId = typeof SORT_IDS[number]
type SortDirection = typeof SORT_DIRECTIONS[number]

const DEFAULT_SORT_ID: SortId = 'totalPaymentsSum'
const DEFAULT_SORT_DIRECTION: SortDirection = 'desc'

const SORT_FIELD_MAP: Record<
  SortId,
  IcelandicGovernmentInstitutionsOpenInvoiceSortField
> = {
  supplier: IcelandicGovernmentInstitutionsOpenInvoiceSortField.SupplierName,
  customer: IcelandicGovernmentInstitutionsOpenInvoiceSortField.DebtorName,
  totalPaymentsSum: IcelandicGovernmentInstitutionsOpenInvoiceSortField.Amount,
}

const toSortDirection = (direction: SortDirection) =>
  direction === 'desc'
    ? IcelandicGovernmentInstitutionsSortDirection.Descending
    : IcelandicGovernmentInstitutionsSortDirection.Ascending

const isSortId = (id: string): id is SortId =>
  SORT_IDS.some((sortId) => sortId === id)

const pageParser = parseAsInteger.withDefault(1)
const sortIdParser = parseAsStringLiteral(SORT_IDS).withDefault(DEFAULT_SORT_ID)
const sortDirectionParser = parseAsStringLiteral(SORT_DIRECTIONS).withDefault(
  DEFAULT_SORT_DIRECTION,
)

const toDebtorIds = (debtors?: string[] | null) =>
  debtors?.map(Number).filter((id): id is number => Number.isInteger(id))

interface AppliedFilters {
  dateFrom: Date
  dateTo: Date
  debtors?: string[]
  suppliers?: string[]
  ministries?: string[]
  paymentTypeIds?: string[]
}

interface SerializedAppliedFilters
  extends Omit<AppliedFilters, 'dateFrom' | 'dateTo'> {
  dateFrom: string
  dateTo: string
}

const OpenInvoicesOverviewPage: CustomScreen<OpenInvoicesOverviewProps> = ({
  locale,
  initialInvoiceGroups,
  initialError,
  initialAppliedFilters,
  customPageData,
  organization,
  today,
}) => {
  useLocalLinkTypeResolver('openinvoices')
  useContentfulId(customPageData?.id)
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const [
    getInvoiceGroups,
    {
      data: invoiceGroupsData,
      previousData: previousInvoiceGroupsData,
      loading: invoiceGroupsLoading,
      error: invoiceGroupsError,
    },
  ] = useLazyQuery<
    {
      icelandicGovernmentInstitutionsInvoicePaymentsGroups: IcelandicGovernmentInstitutionsInvoicePaymentsGroups
    },
    QueryIcelandicGovernmentInstitutionsInvoicePaymentsGroupsArgs
  >(GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_GROUPS)

  const baseUrl = linkResolver('openinvoices', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: formatMessage(m.shared.title),
      href: baseUrl,
      isTag: true,
    },
  ]

  const initialDates = useMemo(() => {
    const dateTo = new Date(today)
    return { dateTo, dateFrom: addMonths(dateTo, -1) }
  }, [today])

  const [currentPage, setCurrentPageParam] = useQueryState('page', pageParser)
  const setCurrentPage = useCallback(
    (page: number) => setCurrentPageParam(page > 1 ? page : null),
    [setCurrentPageParam],
  )

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(() => ({
    ...initialAppliedFilters,
    dateFrom: new Date(initialAppliedFilters.dateFrom),
    dateTo: new Date(initialAppliedFilters.dateTo),
  }))

  const latestInvoiceGroupsData = invoiceGroupsData ?? previousInvoiceGroupsData
  const hasInvoiceGroupsError =
    !!invoiceGroupsError || (initialError && !latestInvoiceGroupsData)
  const invoiceGroups = hasInvoiceGroupsError
    ? undefined
    : latestInvoiceGroupsData
    ? latestInvoiceGroupsData.icelandicGovernmentInstitutionsInvoicePaymentsGroups
    : initialInvoiceGroups
  const displayGroups: IcelandicGovernmentInstitutionsInvoicePaymentsGroup[] =
    invoiceGroups?.data ?? []
  const totalCount = invoiceGroups?.totalCount ?? 0
  const totalPayments = invoiceGroups?.totalPaymentsCount ?? 0
  const totalPaymentsSum = invoiceGroups?.totalPaymentsSum

  const [dateRangeEnd, setDateRangeEnd] = useQueryState(
    'dateRangeEnd',
    parseAsIsoDateTime.withDefault(initialDates.dateTo),
  )
  const [dateRangeStart, setDateRangeStart] = useQueryState(
    'dateRangeStart',
    parseAsIsoDateTime.withDefault(initialDates.dateFrom),
  )
  const [invoicePaymentTypes, setInvoiceTypes] = useQueryState(
    'invoicePaymentTypes',
    parseAsArrayOf(parseAsString),
  )
  const [suppliers, setSuppliers] = useQueryState(
    'suppliers',
    parseAsArrayOf(parseAsString),
  )
  const [debtors, setDebtors] = useQueryState(
    'debtors',
    parseAsArrayOf(parseAsString),
  )
  const [ministries, setMinistries] = useQueryState(
    'ministries',
    parseAsArrayOf(parseAsString),
  )

  const { fetchPage: fetchMinistriesPage, selectedItems: ministriesItems } =
    useAsyncFilterSource(
      GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_MINISTRIES,
      extractMinistries,
      mapMinistry,
      ministries,
    )

  const mapSupplierWithTooltip = useCallback(
    (supplier: Parameters<typeof mapSupplier>[0]) =>
      mapSupplier(supplier, formatMessage),
    [formatMessage],
  )

  const { fetchPage: fetchSuppliersPage, selectedItems: suppliersItems } =
    useAsyncFilterSource(
      GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_SUPPLIERS,
      extractSuppliers,
      mapSupplierWithTooltip,
      suppliers,
    )

  const { fetchPage: fetchDebtorsPage, selectedItems: debtorsItems } =
    useAsyncFilterSource(
      GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_DEBTORS,
      extractDebtors,
      mapDebtor,
      debtors,
    )

  const {
    fetchPage: fetchInvoicePaymentTypeGroupsPage,
    selected: selectedInvoicePaymentTypeGroups,
    selectedItems: invoicePaymentTypeGroupItems,
    toPaymentTypeCodes,
  } = useInvoicePaymentTypeGroupFilter(invoicePaymentTypes)

  const totalHits = totalCount

  const [sortId, setSortId] = useQueryState('sort', sortIdParser)
  const [sortDirectionParam, setSortDirectionParam] = useQueryState(
    'dir',
    sortDirectionParser,
  )
  const sorting: SortingState = useMemo(
    () => [{ id: sortId, desc: sortDirectionParam === 'desc' }],
    [sortId, sortDirectionParam],
  )
  const sortBy = SORT_FIELD_MAP[sortId]
  const sortDirection = toSortDirection(sortDirectionParam)

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const [next] = typeof updater === 'function' ? updater(sorting) : updater
    const nextId = next && isSortId(next.id) ? next.id : DEFAULT_SORT_ID
    const nextDirection = next
      ? next.desc
        ? 'desc'
        : 'asc'
      : DEFAULT_SORT_DIRECTION
    setSortId(nextId === DEFAULT_SORT_ID ? null : nextId)
    setSortDirectionParam(
      nextDirection === DEFAULT_SORT_DIRECTION ? null : nextDirection,
    )
  }

  const buildInput = useCallback(
    (filters: AppliedFilters, page: number) => ({
      debtors: toDebtorIds(filters.debtors),
      suppliers: filters.suppliers,
      ministries: filters.ministries,
      paymentTypeIds: filters.paymentTypeIds,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      sortBy,
      sortDirection,
      limit: PAGE_SIZE,
      page,
    }),
    [sortBy, sortDirection],
  )

  const runInvoiceGroupsQuery = useCallback(
    (page: number) => {
      setCurrentPage(page)
      getInvoiceGroups({
        variables: { input: buildInput(appliedFilters, page) },
      })
    },
    [appliedFilters, buildInput, getInvoiceGroups, setCurrentPage],
  )

  const applyFilters = useCallback(() => {
    const nextFilters: AppliedFilters = {
      dateFrom: dateRangeStart ?? initialDates.dateFrom,
      dateTo: dateRangeEnd ?? initialDates.dateTo,
      debtors: debtors ?? undefined,
      suppliers: suppliers ?? undefined,
      ministries: ministries ?? undefined,
      paymentTypeIds: invoicePaymentTypes ?? undefined,
    }

    setAppliedFilters(nextFilters)
    setCurrentPage(1)
    getInvoiceGroups({ variables: { input: buildInput(nextFilters, 1) } })
  }, [
    buildInput,
    getInvoiceGroups,
    setCurrentPage,
    debtors,
    suppliers,
    ministries,
    invoicePaymentTypes,
    dateRangeStart,
    dateRangeEnd,
    initialDates,
  ])

  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    runInvoiceGroupsQuery(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, sortBy, sortDirection])

  const handlePageChange = (page: number) => {
    runInvoiceGroupsQuery(page)
  }

  const onResetFilter = () => {
    setDateRangeStart(null)
    setDateRangeEnd(null)
    setInvoiceTypes(null)
    setSuppliers(null)
    setDebtors(null)
    setMinistries(null)
  }

  const hitsMessage = useMemo(() => {
    if (totalPayments === 1) {
      return totalPaymentsSum != null
        ? formatMessage(m.search.resultFound, {
            sum: formatCurrency(totalPaymentsSum),
          })
        : formatMessage(m.search.resultFoundNoSum)
    }

    return totalPaymentsSum != null
      ? formatMessage(m.search.resultsFound, {
          records: totalPayments,
          recordsFormatted: formatCurrencyWithoutSuffix(totalPayments),
          sum: formatCurrency(totalPaymentsSum),
        })
      : formatMessage(m.search.resultsFoundNoSum, {
          records: totalPayments,
          recordsFormatted: formatCurrencyWithoutSuffix(totalPayments),
        })
  }, [formatMessage, totalPaymentsSum, totalPayments])

  // Mobile shows the same information as `hitsMessage` split across two
  // short lines instead of one long sentence (matches the Grants Plaza
  // pattern) — the full sentence doesn't fit comfortably on small screens.
  const hitsSummary = useMemo(() => {
    return {
      recordsLine: formatMessage(m.search.recordsFoundShort, {
        records: totalPayments,
        recordsFormatted: formatCurrencyWithoutSuffix(totalPayments),
      }),
      totalLine:
        totalPaymentsSum != null
          ? formatMessage(m.search.totalLineShort, {
              sum: formatCurrency(totalPaymentsSum),
            })
          : undefined,
    }
  }, [formatMessage, totalPaymentsSum, totalPayments])

  const onSearchFilterUpdate = (categoryId: string, values?: Array<string>) => {
    const filteredValues = values?.length ? [...values] : null
    switch (categoryId) {
      case 'dateRange': {
        const dateStart = filteredValues?.[0]
          ? new Date(filteredValues[0])
          : null
        const dateEnd = filteredValues?.[1] ? new Date(filteredValues[1]) : null

        setDateRangeStart(dateStart)
        setDateRangeEnd(dateEnd)
        break
      }
      case 'invoicePaymentTypes': {
        const codes = filteredValues ? toPaymentTypeCodes(filteredValues) : null
        setInvoiceTypes(codes?.length ? codes : null)
        break
      }
      case 'suppliers': {
        setSuppliers(filteredValues)
        break
      }
      case 'debtors': {
        setDebtors(filteredValues)
        // Buyers (debtors) and ministries are mutually exclusive — picking
        // one clears the other.
        if (filteredValues) {
          setMinistries(null)
        }
        break
      }
      case 'ministries': {
        if (filteredValues) {
          setDebtors(null)
        }
        setMinistries(filteredValues)
        break
      }
    }
  }

  const filterSearchState = {
    invoicePaymentTypes: selectedInvoicePaymentTypeGroups,
    suppliers: suppliers ?? undefined,
    debtors: debtors ?? undefined,
    ministries: ministries ?? undefined,
    dateRange: [dateRangeStart.toISOString(), dateRangeEnd.toISOString()],
  }

  const filterCategories = [
    {
      type: 'date' as const,
      id: 'dateRange',
      label: formatMessage(m.search.range),
      valueFrom: dateRangeStart,
      valueTo: dateRangeEnd,
      maxRangeDays: MAX_DATE_RANGE_DAYS,
      maxSelectableDate: initialDates.dateTo,
      isActive:
        dateRangeStart.getTime() !== initialDates.dateFrom.getTime() ||
        dateRangeEnd.getTime() !== initialDates.dateTo.getTime(),
    },
    {
      type: 'asyncSelect' as const,
      id: 'suppliers',
      label: formatMessage(m.search.suppliers),
      fetchPage: fetchSuppliersPage,
      selectedItems: suppliersItems,
    },
    {
      type: 'asyncSelect' as const,
      id: 'debtors',
      label: formatMessage(m.search.customers),
      fetchPage: fetchDebtorsPage,
      selectedItems: debtorsItems,
    },
    {
      type: 'asyncSelect' as const,
      id: 'invoicePaymentTypes',
      label: formatMessage(m.search.types),
      fetchPage: fetchInvoicePaymentTypeGroupsPage,
      selectedItems: invoicePaymentTypeGroupItems,
      initiallyExpanded: (invoicePaymentTypes?.length ?? 0) > 0,
    },
    {
      type: 'asyncSelect' as const,
      id: 'ministries',
      label: formatMessage(m.search.ministries),
      fetchPage: fetchMinistriesPage,
      selectedItems: ministriesItems,
    },
  ]

  const invoiceTable = (
    <>
      <Box marginTop={3}>
        <OverviewTable
          invoiceGroups={displayGroups}
          dateFrom={appliedFilters.dateFrom}
          dateTo={appliedFilters.dateTo}
          paymentTypeIds={appliedFilters.paymentTypeIds}
          ministries={appliedFilters.ministries}
          loading={invoiceGroupsLoading}
          error={hasInvoiceGroupsError}
          sorting={sorting}
          onSortingChange={onSortingChange}
        />
      </Box>

      {totalHits > PAGE_SIZE && (
        <Box marginTop={2}>
          <Pagination
            variant="blue"
            page={currentPage}
            totalItems={totalHits}
            itemsPerPage={PAGE_SIZE}
            renderLink={(page, className, children) => (
              <button
                onClick={() => handlePageChange(page)}
                disabled={invoiceGroupsLoading}
              >
                <span className={className}>{children}</span>
              </button>
            )}
          />
        </Box>
      )}
    </>
  )

  return (
    <OpenInvoicesWrapper
      title={formatMessage(m.overview.title)}
      description={formatMessage(m.overview.description)}
      featuredImage={{
        src: formatMessage(m.overview.featuredImage),
        alt: formatMessage(m.overview.featuredImageAlt),
      }}
      header={{
        breadcrumbs: breadcrumbItems,
        shortcuts: {
          variant: 'tags',
          items: [
            {
              title: formatMessage(m.overview.headerLink1Title),
              href: formatMessage(m.overview.headerLink1Url),
              variant: 'purple',
            },
          ],
        },
      }}
      footer={{
        organization,
      }}
    >
      <Box marginTop={6} background="blue100">
        <SidebarLayout
          fullWidthContent={true}
          hiddenOnTablet
          paddingTop={[3, 3, 8]}
          sidebarContent={
            <Box className={styles.sidebarScroller}>
              <Stack space={3}>
                <Text variant="h4" as="h4" paddingY={1}>
                  {formatMessage(m.overview.searchTitle)}
                </Text>
                <OverviewFilter
                  onSearchUpdate={onSearchFilterUpdate}
                  onReset={onResetFilter}
                  onApply={applyFilters}
                  applyDisabled={invoiceGroupsLoading}
                  url={baseUrl}
                  hits={totalPayments}
                  locale={locale}
                  searchState={filterSearchState}
                  categories={filterCategories}
                />
              </Stack>
            </Box>
          }
        >
          <Box marginLeft={[0, 0, 0, 2]}>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="flexEnd"
              marginBottom={2}
            >
              <Box display={['none', 'none', 'block']}>
                <MarkdownText>
                  {invoiceGroupsLoading
                    ? formatMessage(m.search.fetchingResults)
                    : hitsMessage}
                </MarkdownText>
              </Box>
              <Box display={['block', 'block', 'none']}>
                <MarkdownText>
                  {invoiceGroupsLoading
                    ? formatMessage(m.search.fetchingResults)
                    : hitsSummary.recordsLine}
                </MarkdownText>
                {/* Always mounted so the mobile summary keeps a constant
                    line count — content is hidden rather than unmounted
                    while loading or when there's no sum yet, to avoid the
                    layout shifting up and down. */}
                <Box
                  className={
                    !invoiceGroupsLoading && hitsSummary.totalLine
                      ? undefined
                      : styles.hiddenLine
                  }
                >
                  <MarkdownText>{hitsSummary.totalLine || ' '}</MarkdownText>
                </Box>
              </Box>
              <Box display={['block', 'block', 'block', 'none']}>
                <OverviewFilter
                  onSearchUpdate={onSearchFilterUpdate}
                  onReset={onResetFilter}
                  onApply={applyFilters}
                  applyDisabled={invoiceGroupsLoading}
                  url={baseUrl}
                  hits={totalPayments}
                  locale={locale}
                  searchState={filterSearchState}
                  categories={filterCategories}
                  variant="dialog"
                />
              </Box>
            </Box>
            {invoiceTable}
          </Box>
        </SidebarLayout>
      </Box>
    </OpenInvoicesWrapper>
  )
}

interface OpenInvoicesOverviewProps {
  organization?: Organization
  locale: Locale
  initialInvoiceGroups?: IcelandicGovernmentInstitutionsInvoicePaymentsGroups
  initialError: boolean
  initialAppliedFilters: SerializedAppliedFilters
  today: string
}

OpenInvoicesOverviewPage.getProps = async ({ apolloClient, locale, query }) => {
  const today = new Date()
  const todayIso = today.toISOString()

  const {
    data: { getOrganization },
  } = await apolloClient.query<Query, QueryGetOrganizationArgs>({
    query: GET_ORGANIZATION_QUERY,
    variables: {
      input: {
        slug: ORGANIZATION_SLUG,
        lang: locale,
      },
    },
  })

  const arrayParser = parseAsArrayOf<string>(parseAsString)
  const filterArray = <T,>(array: Array<T> | null | undefined) => {
    if (array && array.length > 0) {
      return array
    }

    return undefined
  }

  const [
    debtorsFilter,
    suppliersFilter,
    invoicePaymentTypesFilter,
    ministriesFilter,
  ]: Array<Array<string> | undefined> = [
    'debtors',
    'suppliers',
    'invoicePaymentTypes',
    'ministries',
  ].map((resource) =>
    filterArray<string>(arrayParser.parseServerSide(query?.[resource])),
  )

  const debtorsInput = debtorsFilter?.filter(isDefined)
  const suppliersInput = suppliersFilter?.filter(isDefined)
  const invoicePaymentTypesInput = invoicePaymentTypesFilter?.filter(isDefined)
  const ministriesInput = ministriesFilter?.filter(isDefined)

  /*
    Rebuilds the current URL with `omit` dropped and `overrides` applied, so a
    correction redirect keeps every other filter the visitor arrived with.
  */
  const buildUrl = (
    omit: Array<string>,
    overrides: Record<string, string> = {},
  ) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query ?? {})) {
      if (omit.includes(key) || key in overrides) continue
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else if (value !== undefined) {
        params.append(key, value)
      }
    }
    for (const [key, value] of Object.entries(overrides)) {
      params.append(key, value)
    }

    const path = linkResolver('openinvoices', [], locale as Locale).href
    const search = params.toString()
    return search ? `${path}?${search}` : path
  }

  /*
    Buyers (debtors) and ministries are mutually exclusive — if both are in the
    URL, buyers wins and ministries is redirected away rather than silently
    dropped from the query, so the URL stays a true reflection of the applied
    filters.
  */
  if (debtorsInput && ministriesInput) {
    throw new CustomNextRedirect(buildUrl(['ministries']))
  }

  const parsedDateTo = parseAsIsoDateTime.parseServerSide(
    query?.['dateRangeEnd'],
  )
  const parsedDateFrom = parseAsIsoDateTime.parseServerSide(
    query?.['dateRangeStart'],
  )
  const requestedDateTo = parsedDateTo ?? today
  const requestedDateFrom = parsedDateFrom ?? addMonths(requestedDateTo, -1)

  const dateFromInput = requestedDateFrom > today ? today : requestedDateFrom
  const maxRangeEnd = addDays(dateFromInput, MAX_DATE_RANGE_DAYS)
  const toDateClamp = maxRangeEnd < today ? maxRangeEnd : today

  let dateToInput = requestedDateTo
  if (dateToInput < dateFromInput) {
    dateToInput = dateFromInput
  } else if (dateToInput > toDateClamp) {
    dateToInput = toDateClamp
  }

  if (
    !parsedDateFrom !== !parsedDateTo ||
    dateFromInput.getTime() !== requestedDateFrom.getTime() ||
    dateToInput.getTime() !== requestedDateTo.getTime()
  ) {
    throw new CustomNextRedirect(
      buildUrl([], {
        dateRangeStart: dateFromInput.toISOString(),
        dateRangeEnd: dateToInput.toISOString(),
      }),
    )
  }

  const pageInput = Math.max(1, pageParser.parseServerSide(query?.['page']))
  const sortIdInput = sortIdParser.parseServerSide(query?.['sort'])
  const sortDirectionInput = sortDirectionParser.parseServerSide(query?.['dir'])

  let invoiceGroups: IcelandicGovernmentInstitutionsInvoicePaymentsGroups | null =
    null
  let initialError = false
  try {
    const { data } = await apolloClient.query<
      Query,
      QueryIcelandicGovernmentInstitutionsInvoicePaymentsGroupsArgs
    >({
      query: GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_GROUPS,
      variables: {
        input: {
          dateFrom: dateFromInput,
          dateTo: dateToInput,
          debtors: toDebtorIds(debtorsInput),
          suppliers: suppliersInput,
          ministries: ministriesInput,
          paymentTypeIds: invoicePaymentTypesInput,
          sortBy: SORT_FIELD_MAP[sortIdInput],
          sortDirection: toSortDirection(sortDirectionInput),
          limit: PAGE_SIZE,
          page: pageInput,
        },
      },
    })
    invoiceGroups =
      data.icelandicGovernmentInstitutionsInvoicePaymentsGroups ?? null
  } catch {
    initialError = true
  }

  const lastPage = Math.max(
    1,
    Math.ceil((invoiceGroups?.totalCount ?? 0) / PAGE_SIZE),
  )
  if (!initialError && pageInput > lastPage) {
    throw new CustomNextRedirect(
      buildUrl(['page'], lastPage > 1 ? { page: String(lastPage) } : {}),
    )
  }

  return {
    locale: locale as Locale,
    initialInvoiceGroups: invoiceGroups ?? undefined,
    initialError,
    initialAppliedFilters: {
      dateFrom: dateFromInput.toISOString(),
      dateTo: dateToInput.toISOString(),
      debtors: debtorsInput,
      suppliers: suppliersInput,
      ministries: ministriesInput,
      paymentTypeIds: invoicePaymentTypesInput,
    },
    organization: getOrganization ?? undefined,
    today: todayIso,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OpenInvoices,
    OpenInvoicesOverviewPage,
  ),
)
