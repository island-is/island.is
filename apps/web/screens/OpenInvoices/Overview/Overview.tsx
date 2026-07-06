import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import {
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsString,
  useQueryState,
} from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  Pagination,
  SortingState,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { dateFormat } from '@island.is/shared/constants'
import { CustomPageUniqueIdentifier, Locale } from '@island.is/shared/types'
import { formatCurrency, isDefined } from '@island.is/shared/utils'
import { MarkdownText } from '@island.is/web/components'
import {
  IcelandicGovernmentInstitutionsInvoiceGroup,
  IcelandicGovernmentInstitutionsInvoiceGroups,
  IcelandicGovernmentInstitutionsOpenInvoiceSortField,
  IcelandicGovernmentInstitutionsSortDirection,
  Organization,
  Query,
  QueryGetOrganizationArgs,
  QueryIcelandicGovernmentInstitutionsInvoiceGroupsArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'

import { CustomScreen, withCustomPageWrapper } from '../../CustomPage'
import SidebarLayout from '../../Layouts/SidebarLayout'
import { GET_ORGANIZATION_QUERY } from '../../queries'
import { OpenInvoicesWrapper } from '../components/OpenInvoicesWrapper'
import { OverviewFilter } from '../components/OverviewFilter'
import { ORGANIZATION_SLUG } from '../constants'
import {
  extractDebtors,
  extractInvoicePaymentTypes,
  extractMinistries,
  extractSuppliers,
  mapDebtor,
  mapInvoicePaymentType,
  mapMinistry,
  mapSupplier,
} from '../hooks/asyncFilterSources'
import { useAsyncFilterSource } from '../hooks/useAsyncFilterSource'
import { m } from '../messages'
import {
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_DEBTORS,
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_GROUPS,
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_PAYMENT_TYPES,
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_MINISTRIES,
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_SUPPLIERS,
} from './Overview.graphql'
import { OverviewTable } from './OverviewTable'

const PAGE_SIZE = 12

const SORT_FIELD_MAP: Record<
  string,
  IcelandicGovernmentInstitutionsOpenInvoiceSortField
> = {
  supplier: IcelandicGovernmentInstitutionsOpenInvoiceSortField.SupplierName,
  customer: IcelandicGovernmentInstitutionsOpenInvoiceSortField.DebtorName,
  totalSum: IcelandicGovernmentInstitutionsOpenInvoiceSortField.Amount,
}

const toDebtorIds = (debtors?: string[] | null) =>
  debtors?.map(Number).filter((id): id is number => Number.isInteger(id))

const OpenInvoicesOverviewPage: CustomScreen<OpenInvoicesOverviewProps> = ({
  locale,
  initialInvoiceGroups,
  customPageData,
  organization,
  today,
}) => {
  useLocalLinkTypeResolver()
  useContentfulId(customPageData?.id)
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const [
    getInvoiceGroups,
    {
      data: invoiceGroupsData,
      loading: invoiceGroupsLoading,
      error: invoiceGroupsError,
    },
  ] = useLazyQuery<
    {
      icelandicGovernmentInstitutionsInvoiceGroups: IcelandicGovernmentInstitutionsInvoiceGroups
    },
    QueryIcelandicGovernmentInstitutionsInvoiceGroupsArgs
  >(GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_GROUPS)

  const baseUrl = linkResolver('openinvoices', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: formatMessage(m.overview.title),
      href: baseUrl,
      isTag: true,
    },
  ]

  const initialDates = useMemo(() => {
    const dateTo = new Date(today)
    return { dateTo, dateFrom: addMonths(dateTo, -1) }
  }, [today])

  const [initialRender, setInitialRender] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const fetchedResult =
    invoiceGroupsData?.icelandicGovernmentInstitutionsInvoiceGroups
  const displayGroups: IcelandicGovernmentInstitutionsInvoiceGroup[] =
    fetchedResult?.data ?? initialInvoiceGroups?.data ?? []
  const totalCount =
    fetchedResult?.totalCount ?? initialInvoiceGroups?.totalCount ?? 0

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

  const { fetchPage: fetchMinistriesPage, selectedLabels: ministriesLabels } =
    useAsyncFilterSource(
      GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_MINISTRIES,
      extractMinistries,
      mapMinistry,
      ministries,
    )

  const { fetchPage: fetchSuppliersPage, selectedLabels: suppliersLabels } =
    useAsyncFilterSource(
      GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_SUPPLIERS,
      extractSuppliers,
      mapSupplier,
      suppliers,
    )

  const { fetchPage: fetchDebtorsPage, selectedLabels: debtorsLabels } =
    useAsyncFilterSource(
      GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_DEBTORS,
      extractDebtors,
      mapDebtor,
      debtors,
    )

  const {
    fetchPage: fetchInvoicePaymentTypesPage,
    selectedLabels: invoicePaymentTypesLabels,
  } = useAsyncFilterSource(
    GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_PAYMENT_TYPES,
    extractInvoicePaymentTypes,
    mapInvoicePaymentType,
    invoicePaymentTypes,
  )

  const totalHits = totalCount

  const [sorting, setSorting] = useState<SortingState>([])
  const sortBy = sorting[0] ? SORT_FIELD_MAP[sorting[0].id] : undefined
  const sortDirection = sorting[0]
    ? sorting[0].desc
      ? IcelandicGovernmentInstitutionsSortDirection.Descending
      : IcelandicGovernmentInstitutionsSortDirection.Ascending
    : undefined

  const fetchInvoiceGroups = useCallback(() => {
    if (initialRender) {
      setInitialRender(false)
      return
    }

    setCurrentPage(1)
    getInvoiceGroups({
      variables: {
        input: {
          debtors: toDebtorIds(debtors),
          suppliers,
          ministries,
          paymentTypeIds: invoicePaymentTypes,
          dateFrom: dateRangeStart ?? initialDates.dateFrom,
          dateTo: dateRangeEnd ?? initialDates.dateTo,
          sortBy,
          sortDirection,
          limit: PAGE_SIZE,
          page: 1,
        },
      },
    })
  }, [
    getInvoiceGroups,
    initialRender,
    debtors,
    suppliers,
    ministries,
    invoicePaymentTypes,
    dateRangeStart,
    dateRangeEnd,
    sortBy,
    sortDirection,
  ])

  // Filter fields (debtors/suppliers/ministries/invoicePaymentTypes/date
  // range) intentionally don't trigger this effect — they're only applied
  // when the filter panel's submit button is clicked (see `onApply` below),
  // so rapid filter changes can't pile up/race requests against the server.
  useEffect(() => {
    fetchInvoiceGroups()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, sortBy, sortDirection])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    getInvoiceGroups({
      variables: {
        input: {
          debtors: toDebtorIds(debtors),
          suppliers,
          ministries,
          paymentTypeIds: invoicePaymentTypes,
          dateFrom: dateRangeStart ?? initialDates.dateFrom,
          dateTo: dateRangeEnd ?? initialDates.dateTo,
          sortBy,
          sortDirection,
          limit: PAGE_SIZE,
          page,
        },
      },
    })
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
    const dateRangeStartArg = format(dateRangeStart, dateFormat.is)
    const dateRangeEndArg = format(dateRangeEnd, dateFormat.is)
    const totalPaymentsSum =
      invoiceGroupsData?.icelandicGovernmentInstitutionsInvoiceGroups
        ?.totalPaymentsSum ?? initialInvoiceGroups?.totalPaymentsSum

    if (totalHits === 1) {
      return totalPaymentsSum
        ? formatMessage(m.search.resultFound, {
            dateRangeStart: dateRangeStartArg,
            dateRangeEnd: dateRangeEndArg,
            sum: formatCurrency(totalPaymentsSum),
          })
        : formatMessage(m.search.resultFoundNoSum, {
            dateRangeStart: dateRangeStartArg,
            dateRangeEnd: dateRangeEndArg,
          })
    }

    return totalPaymentsSum
      ? formatMessage(m.search.resultsFound, {
          records: totalHits,
          dateRangeStart: dateRangeStartArg,
          dateRangeEnd: dateRangeEndArg,
          sum: formatCurrency(totalPaymentsSum),
        })
      : formatMessage(m.search.resultsFoundNoSum, {
          records: totalHits,
          dateRangeStart: dateRangeStartArg,
          dateRangeEnd: dateRangeEndArg,
        })
  }, [
    dateRangeEnd,
    dateRangeStart,
    formatMessage,
    initialInvoiceGroups?.totalPaymentsSum,
    invoiceGroupsData?.icelandicGovernmentInstitutionsInvoiceGroups
      ?.totalPaymentsSum,
    totalHits,
  ])

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
        setInvoiceTypes(filteredValues)
        break
      }
      case 'suppliers': {
        setSuppliers(filteredValues)
        break
      }
      case 'debtors': {
        setDebtors(filteredValues)
        break
      }
      case 'ministries': {
        setMinistries(filteredValues)
        break
      }
    }
  }

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
            {
              title: formatMessage(m.overview.headerLink2Title),
              href: formatMessage(m.overview.headerLink2Url),
              variant: 'purple',
            },
          ],
        },
      }}
      footer={{
        organization,
      }}
    >
      <Box marginTop={12} background="blue100">
        <SidebarLayout
          fullWidthContent={true}
          sidebarContent={
            <Stack space={3}>
              <Text variant="h4" as="h4" paddingY={1}>
                {formatMessage(m.overview.searchTitle)}
              </Text>
              <OverviewFilter
                onSearchUpdate={onSearchFilterUpdate}
                onReset={onResetFilter}
                onApply={fetchInvoiceGroups}
                applyDisabled={invoiceGroupsLoading}
                url={baseUrl}
                hits={totalHits}
                locale={locale}
                searchState={{
                  invoicePaymentTypes:
                    invoicePaymentTypes?.map((i) => i.toString()) ?? undefined,
                  suppliers: suppliers ?? undefined,
                  debtors: debtors ?? undefined,
                  ministries: ministries ?? undefined,
                  dateRange: [
                    dateRangeStart.toISOString(),
                    dateRangeEnd.toISOString(),
                  ],
                }}
                categories={[
                  {
                    type: 'date',
                    id: 'dateRange',
                    label: formatMessage(m.search.range),
                    placeholder: `${format(
                      dateRangeStart,
                      dateFormat.is,
                    )}-${format(dateRangeEnd, dateFormat.is)}`,
                    valueFrom: dateRangeStart,
                    valueTo: dateRangeEnd,
                  },
                  {
                    type: 'asyncSelect',
                    id: 'suppliers',
                    label: formatMessage(m.search.suppliers),
                    fetchPage: fetchSuppliersPage,
                    selectedLabels: suppliersLabels,
                  },
                  {
                    type: 'asyncSelect',
                    id: 'debtors',
                    label: formatMessage(m.search.customers),
                    fetchPage: fetchDebtorsPage,
                    selectedLabels: debtorsLabels,
                  },
                  {
                    type: 'asyncSelect',
                    id: 'invoicePaymentTypes',
                    label: formatMessage(m.search.types),
                    fetchPage: fetchInvoicePaymentTypesPage,
                    selectedLabels: invoicePaymentTypesLabels,
                  },
                  {
                    type: 'asyncSelect',
                    id: 'ministries',
                    label: formatMessage(m.search.ministries),
                    fetchPage: fetchMinistriesPage,
                    selectedLabels: ministriesLabels,
                  },
                ]}
              />
            </Stack>
          }
        >
          <Box marginLeft={2}>
            <MarkdownText>{hitsMessage ?? ''}</MarkdownText>
            <Box marginTop={3}>
              <OverviewTable
                invoiceGroups={displayGroups}
                dateFrom={dateRangeStart}
                dateTo={dateRangeEnd}
                loading={invoiceGroupsLoading}
                error={invoiceGroupsError}
                sorting={sorting}
                onSortingChange={setSorting}
              />
            </Box>
          </Box>

          {totalHits > PAGE_SIZE && !invoiceGroupsLoading && (
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
        </SidebarLayout>
      </Box>
    </OpenInvoicesWrapper>
  )
}

interface OpenInvoicesOverviewProps {
  organization?: Organization
  locale: Locale
  initialInvoiceGroups?: IcelandicGovernmentInstitutionsInvoiceGroups
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

  const debtorsInput = debtorsFilter?.filter(isDefined) || undefined
  const suppliersInput = suppliersFilter?.filter(isDefined) || undefined
  const invoicePaymentTypesInput = invoicePaymentTypesFilter?.filter(isDefined)
  const ministriesInput = ministriesFilter?.filter(isDefined) || undefined

  const dateToInput =
    parseAsIsoDateTime.parseServerSide(query?.['dateRangeEnd']) ?? today
  const dateFromInput =
    parseAsIsoDateTime.parseServerSide(query?.['dateRangeStart']) ??
    addMonths(dateToInput, -1)

  const {
    data: { icelandicGovernmentInstitutionsInvoiceGroups },
  } = await apolloClient.query<
    Query,
    QueryIcelandicGovernmentInstitutionsInvoiceGroupsArgs
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
        limit: PAGE_SIZE,
        page: 1,
      },
    },
  })

  return {
    locale: locale as Locale,
    initialInvoiceGroups:
      icelandicGovernmentInstitutionsInvoiceGroups ?? undefined,
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
