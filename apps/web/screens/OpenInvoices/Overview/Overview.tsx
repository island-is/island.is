import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import debounce from 'lodash/debounce'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDateTime,
  useQueryState,
} from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  FilterInput,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { dateFormat, debounceTime } from '@island.is/shared/constants'
import { CustomPageUniqueIdentifier, Locale } from '@island.is/shared/types'
import { MarkdownText } from '@island.is/web/components'
import {
  IcelandicGovernmentInstitutionsInvoiceGroup,
  IcelandicGovernmentInstitutionsInvoices,
  Organization,
  Query,
  QueryGetOrganizationArgs,
  QueryIcelandicGovernmentInstitutionsInvoicesArgs,
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
import { ORGANIZATION_SLUG } from '../contants'
import { m } from '../messages'
import { OverviewFilters } from '../types'
import {
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICES,
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICES_FILTERS,
} from './Overview.graphql'
import { OverviewContent } from './OverviewContent'

const PAGE_SIZE = 12

const OpenInvoicesOverviewPage: CustomScreen<OpenInvoicesOverviewProps> = ({
  locale,
  filters,
  initialInvoices,
  customPageData,
  organization,
}) => {
  useLocalLinkTypeResolver()
  useContentfulId(customPageData?.id)
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const [getInvoices] = useLazyQuery<
    {
      icelandicGovernmentInstitutionsInvoices: IcelandicGovernmentInstitutionsInvoices
    },
    QueryIcelandicGovernmentInstitutionsInvoicesArgs
  >(GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICES)

  const baseUrl = linkResolver('openinvoicesoverview', [], locale).href

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
    const today = new Date()
    return {
      dateFrom: addMonths(today, -1),
      dateTo: today,
    }
  }, [])

  const [initialRender, setInitialRender] = useState<boolean>(true)

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [query, setQuery] = useQueryState('query')
  const [dateRangeStart, setDateRangeStart] = useQueryState(
    'dateRangeStart',
    parseAsIsoDateTime.withDefault(initialDates.dateFrom),
  )
  const [dateRangeEnd, setDateRangeEnd] = useQueryState(
    'dateRangeEnd',
    parseAsIsoDateTime.withDefault(initialDates.dateTo),
  )
  const [invoiceTypes, setInvoiceTypes] = useQueryState(
    'invoiceTypes',
    parseAsArrayOf(parseAsInteger),
  )
  const [suppliers, setSuppliers] = useQueryState(
    'suppliers',
    parseAsArrayOf(parseAsInteger),
  )
  const [customers, setCustomers] = useQueryState(
    'customers',
    parseAsArrayOf(parseAsInteger),
  )
  const [searchString, setSearchString] = useState<string | null>()

  const [invoiceGroups, setInvoiceGroups] = useState<
    Array<IcelandicGovernmentInstitutionsInvoiceGroup>
  >(initialInvoices?.data ?? [])

  const [totalHits, setTotalHits] = useState<number | undefined>(
    initialInvoices?.totalCount ?? 0,
  )

  const totalPages = useMemo(() => {
    if (!totalHits) {
      return
    }
    return totalHits > PAGE_SIZE ? Math.ceil(totalHits / PAGE_SIZE) : 1
  }, [totalHits])

  const fetchInvoices = useCallback(() => {
    if (initialRender) {
      setInitialRender(false)
      return
    }

    const today = new Date()

    getInvoices({
      variables: {
        input: {
          customers,
          suppliers,
          types: invoiceTypes,
          dateFrom: dateRangeStart ?? addMonths(today, -1),
          dateTo: dateRangeEnd ?? today,
          limit: PAGE_SIZE,
        },
      },
    })
      .then((res) => {
        if (res.data) {
          setInvoiceGroups(
            res.data.icelandicGovernmentInstitutionsInvoices.data,
          )
          setTotalHits(
            res.data.icelandicGovernmentInstitutionsInvoices.totalCount,
          )
        } else if (res.error) {
          setInvoiceGroups([])
        }
      })
      .catch(() => {
        setInvoiceGroups([])
      })
  }, [
    initialRender,
    getInvoices,
    customers,
    suppliers,
    invoiceTypes,
    dateRangeStart,
    dateRangeEnd,
  ])

  useEffect(() => {
    fetchInvoices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    customers,
    locale,
    suppliers,
    searchString,
    invoiceTypes,
    dateRangeStart,
    dateRangeEnd,
  ])

  //SEARCH STATE UPDATES
  const debouncedSearchUpdate = useMemo(() => {
    return debounce(() => {
      setSearchString(query)
      setPage(null)
    }, debounceTime.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    debouncedSearchUpdate()
    return () => {
      debouncedSearchUpdate.cancel()
    }
  }, [debouncedSearchUpdate])

  const onResetFilter = () => {
    setPage(null)
    setQuery(null)
    setSearchString(null)
    setDateRangeStart(null)
    setDateRangeEnd(null)
    setInvoiceTypes(null)
    setSuppliers(null)
    setCustomers(null)
  }

  const hitsMessage = useMemo(() => {
    if (!totalHits) {
      return
    }
    const dateRangeStartArg = format(dateRangeStart, dateFormat.is)
    const dateRangeEndArg = format(dateRangeEnd, dateFormat.is)
    //const sumArg = formatCurrency(67418961)
    const sumArg = 'PLACEHOLDER'

    if (totalHits === 1) {
      return formatMessage(m.search.resultFound, {
        dateRangeStart: dateRangeStartArg,
        dateRangeEnd: dateRangeEndArg,
        sum: sumArg,
      })
    }
    return formatMessage(m.search.resultsFound, {
      records: totalHits,
      dateRangeStart: dateRangeStartArg,
      dateRangeEnd: dateRangeEndArg,
      sum: sumArg,
    })
  }, [dateRangeEnd, dateRangeStart, formatMessage, totalHits])

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
      case 'invoiceTypes': {
        setInvoiceTypes(filteredValues?.map((f) => Number.parseInt(f)) ?? null)
        break
      }
      case 'suppliers': {
        setSuppliers(filteredValues?.map((f) => Number.parseInt(f)) ?? null)
        break
      }
      case 'customers': {
        setCustomers(filteredValues?.map((f) => Number.parseInt(f)) ?? null)
        break
      }
    }
    setPage(null)
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
      }}
      footer={
        organization
          ? {
              organization,
            }
          : undefined
      }
    >
      <Box marginTop={12} background="blue100">
        <SidebarLayout
          fullWidthContent={true}
          sidebarContent={
            <Stack space={3}>
              <Text variant="h4" as="h4" paddingY={1}>
                {formatMessage(m.overview.searchTitle)}
              </Text>
              <FilterInput
                name="query"
                placeholder={formatMessage(m.overview.searchInputPlaceholder)}
                value={query ?? ''}
                onChange={(option) => setQuery(option)}
              />
              <OverviewFilter
                onSearchUpdate={onSearchFilterUpdate}
                onReset={onResetFilter}
                url={baseUrl}
                hits={totalHits}
                locale={locale}
                searchState={{
                  invoiceTypes:
                    invoiceTypes?.map((i) => i.toString()) ?? undefined,
                  suppliers: suppliers?.map((s) => s.toString()) ?? undefined,
                  customers: customers?.map((c) => c.toString()) ?? undefined,
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
                    type: 'multi',
                    sections: [
                      {
                        id: 'invoiceTypes',
                        label: formatMessage(m.search.type),
                        items:
                          filters?.invoiceTypes.map((filter) => ({
                            value: filter.value,
                            label: filter.name,
                          })) ?? [],
                      },
                      {
                        id: 'suppliers',
                        label: formatMessage(m.search.suppliers),
                        items:
                          filters?.suppliers.map((filter) => ({
                            value: filter.value,
                            label: filter.name,
                          })) ?? [],
                      },
                      {
                        id: 'customers',
                        label: formatMessage(m.search.customers),
                        items:
                          filters?.customers.map((filter) => ({
                            value: filter.value,
                            label: filter.name,
                          })) ?? [],
                      },
                    ],
                  },
                ]}
              />
            </Stack>
          }
        >
          <MarkdownText>{hitsMessage ?? ""}</MarkdownText>
          <Box marginLeft={2} background="white">
            <OverviewContent invoiceGroups={invoiceGroups} />
          </Box>

          <Box marginTop={2} marginBottom={0} hidden={(totalPages ?? 0) <= 1}>
            <Pagination
              variant="purple"
              page={page}
              itemsPerPage={PAGE_SIZE}
              totalItems={totalHits}
              totalPages={totalPages}
              renderLink={(page, className, children) => (
                <Box
                  cursor="pointer"
                  className={className}
                  onClick={() => {
                    setPage(page)
                  }}
                >
                  {children}
                </Box>
              )}
            />
          </Box>
        </SidebarLayout>
      </Box>
    </OpenInvoicesWrapper>
  )
}

interface OpenInvoicesOverviewProps {
  organization?: Organization
  locale: Locale
  filters?: OverviewFilters
  initialInvoices?: IcelandicGovernmentInstitutionsInvoices
}

const OpenInvoicesOverview: CustomScreen<OpenInvoicesOverviewProps> = ({
  organization,
  locale,
  filters,
  initialInvoices,
  customPageData,
}) => {
  return (
    <OpenInvoicesOverviewPage
      organization={organization}
      locale={locale}
      customPageData={customPageData}
      filters={filters}
      initialInvoices={initialInvoices}
    />
  )
}

OpenInvoicesOverview.getProps = async ({ apolloClient, locale }) => {
  const today = new Date()
  const oneMonthBack = addMonths(today, -1)
  const [
    {
      data: { icelandicGovernmentInstitutionsInvoicesFilters },
    },
    {
      data: { icelandicGovernmentInstitutionsInvoices },
    },
    {
      data: { getOrganization },
    },
  ] = await Promise.all([
    apolloClient.query<Query>({
      query: GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICES_FILTERS,
    }),
    apolloClient.query<Query>({
      query: GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICES,
      variables: {
        input: {
          dateFrom: oneMonthBack,
          dateTo: today,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: ORGANIZATION_SLUG,
          lang: locale,
        },
      },
    }),
  ])

  const filters: OverviewFilters | undefined =
    icelandicGovernmentInstitutionsInvoicesFilters
      ? {
          suppliers:
            icelandicGovernmentInstitutionsInvoicesFilters.suppliers?.data?.map(
              (supplier) => ({
                name: supplier.name,
                value: supplier.id,
              }),
            ) ?? [],
          customers:
            icelandicGovernmentInstitutionsInvoicesFilters.customers?.data?.map(
              (customer) => ({
                name: customer.name,
                value: customer.id,
              }),
            ) ?? [],
          invoiceTypes:
            icelandicGovernmentInstitutionsInvoicesFilters?.invoiceTypes?.data?.map(
              (invoiceType) => ({
                name: invoiceType.name,
                value: invoiceType.id,
              }),
            ) ?? [],
        }
      : undefined

  return {
    locale: locale as Locale,
    filters,
    initialInvoices: icelandicGovernmentInstitutionsInvoices ?? undefined,
    organization: getOrganization ?? undefined,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OpenInvoices,
    OpenInvoicesOverview,
  ),
  { showFooter: false },
)
