import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryState,
} from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import { Box, Pagination, Stack, Text } from '@island.is/island-ui/core'
import { dateFormat } from '@island.is/shared/constants'
import { CustomPageUniqueIdentifier, Locale } from '@island.is/shared/types'
import { formatCurrency, isDefined } from '@island.is/shared/utils'
import { MarkdownText } from '@island.is/web/components'
import {
  IcelandicGovernmentInstitutionsInvoiceGroups,
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
import { ORGANIZATION_SLUG } from '../contants'
import { m } from '../messages'
import { OverviewFilters } from '../types'
import {
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_GROUPS,
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICES_FILTERS,
} from './Overview.graphql'
import { OverviewTable } from './OverviewTable'

const PAGE_SIZE = 12

const OpenInvoicesOverviewPage: CustomScreen<OpenInvoicesOverviewProps> = ({
  locale,
  filters,
  initialInvoiceGroups,
  customPageData,
  organization,
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
    const dateTo = new Date()
    return { dateTo, dateFrom: addMonths(dateTo, -1) }
  }, [])

  const [initialRender, setInitialRender] = useState<boolean>(true)

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
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
    parseAsArrayOf(parseAsInteger),
  )
  const [customers, setCustomers] = useQueryState(
    'customers',
    parseAsArrayOf(parseAsInteger),
  )

  const totalHits = useMemo(() => {
    if (
      invoiceGroupsData?.icelandicGovernmentInstitutionsInvoiceGroups.totalCount
    ) {
      return invoiceGroupsData?.icelandicGovernmentInstitutionsInvoiceGroups
        .totalCount
    } else return initialInvoiceGroups?.totalCount ?? 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    invoiceGroupsData?.icelandicGovernmentInstitutionsInvoiceGroups?.totalCount,
  ])

  const totalPages = useMemo(() => {
    return totalHits > PAGE_SIZE ? Math.ceil(totalHits / PAGE_SIZE) : 1
  }, [totalHits])

  const fetchInvoiceGroups = useCallback(() => {
    if (initialRender) {
      setInitialRender(false)
      return
    }

    const today = new Date()

    getInvoiceGroups({
      variables: {
        input: {
          customers,
          suppliers,
          types: invoicePaymentTypes,
          dateFrom: dateRangeStart ?? addMonths(today, -1),
          dateTo: dateRangeEnd ?? today,
          limit: PAGE_SIZE,
        },
      },
    })
  }, [
    getInvoiceGroups,
    initialRender,
    customers,
    suppliers,
    invoicePaymentTypes,
    dateRangeStart,
    dateRangeEnd,
  ])

  useEffect(() => {
    fetchInvoiceGroups()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    customers,
    locale,
    suppliers,
    invoicePaymentTypes,
    dateRangeStart,
    dateRangeEnd,
  ])

  const onResetFilter = () => {
    setPage(null)
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
    const sumArg = invoiceGroupsData
      ?.icelandicGovernmentInstitutionsInvoiceGroups?.totalPaymentsSum
      ? formatCurrency(
          invoiceGroupsData?.icelandicGovernmentInstitutionsInvoiceGroups
            ?.totalPaymentsSum,
        )
      : 0

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
  }, [
    dateRangeEnd,
    dateRangeStart,
    formatMessage,
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
                url={baseUrl}
                hits={totalHits}
                locale={locale}
                searchState={{
                  invoicePaymentTypes:
                    invoicePaymentTypes?.map((i) => i.toString()) ?? undefined,
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
                        id: 'suppliers',
                        label: formatMessage(m.search.suppliers),
                        items:
                          filters?.suppliers?.map((filter) => ({
                            value: filter.value,
                            label: filter.name,
                          })) ?? [],
                      },
                      {
                        id: 'customers',
                        label: formatMessage(m.search.customers),
                        items:
                          filters?.customers?.map((filter) => ({
                            value: filter.value,
                            label: filter.name,
                          })) ?? [],
                      },
                    ],
                  },
                  {
                    type: 'select',
                    id: 'invoicePaymentTypes',
                    label: formatMessage(m.search.types),
                    placeholder: '',
                    items:
                      filters?.invoicePaymentTypes
                        ?.filter((f) => f.name && f.value)
                        .map((filter) => ({
                          value: filter.value,
                          label: filter.name,
                        })) ?? [],
                  },
                ]}
              />
            </Stack>
          }
        >
          <MarkdownText>{hitsMessage ?? ''}</MarkdownText>
          <Box marginLeft={2} background="white">
            <OverviewTable
              invoiceGroups={
                invoiceGroupsData?.icelandicGovernmentInstitutionsInvoiceGroups
                  ?.data ??
                initialInvoiceGroups?.data ??
                []
              }
              dateFrom={dateRangeStart}
              dateTo={dateRangeEnd}
              loading={invoiceGroupsLoading}
              error={invoiceGroupsError}
            />
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
  initialInvoiceGroups?: IcelandicGovernmentInstitutionsInvoiceGroups
}

const OpenInvoicesOverview: CustomScreen<OpenInvoicesOverviewProps> = ({
  organization,
  locale,
  filters,
  initialInvoiceGroups,
  customPageData,
}) => {
  return (
    <OpenInvoicesOverviewPage
      organization={organization}
      locale={locale}
      customPageData={customPageData}
      filters={filters}
      initialInvoiceGroups={initialInvoiceGroups}
    />
  )
}

OpenInvoicesOverview.getProps = async ({ apolloClient, locale, query }) => {
  const today = new Date()

  const [
    {
      data: { icelandicGovernmentInstitutionsInvoicesFilters },
    },
    {
      data: { getOrganization },
    },
  ] = await Promise.all([
    apolloClient.query<Query>({
      query: GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICES_FILTERS,
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
          invoicePaymentTypes:
            icelandicGovernmentInstitutionsInvoicesFilters?.invoicePaymentTypes?.data?.map(
              (invoiceType) => ({
                name: invoiceType.name,
                value: invoiceType.code,
              }),
            ) ?? undefined,
        }
      : undefined

  const arrayParser = parseAsArrayOf<string>(parseAsString)
  const filterArray = <T,>(array: Array<T> | null | undefined) => {
    if (array && array.length > 0) {
      return array
    }

    return undefined
  }

  const [customersFilter, suppliersFilter, invoicePaymentTypesFilter]: Array<
    Array<string> | undefined
  > = ['customers', 'suppliers', 'invoicePaymentTypes'].map((resource) =>
    filterArray<string>(arrayParser.parseServerSide(query?.[resource])),
  )

  const customersInput =
    customersFilter
      ?.map((customerId) => parseInt(customerId) ?? null)
      .filter(isDefined) || undefined
  const suppliersInput =
    suppliersFilter
      ?.map((supplierId) => parseInt(supplierId) ?? null)
      .filter(isDefined) || undefined
  const invoicePaymentTypesInput = invoicePaymentTypesFilter?.filter(isDefined)

  const dateToInput =
    parseAsIsoDateTime.parseServerSide(query?.['dateRangeEnd']) ?? today
  const dateFromInput =
    parseAsIsoDateTime.parseServerSide(query?.['dateRangeStart']) ??
    addMonths(dateToInput, -1)

  const {
    data: { icelandicGovernmentInstitutionsInvoiceGroups },
  } = await apolloClient.query<Query>({
    query: GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_GROUPS,
    variables: {
      input: {
        dateFrom: dateFromInput,
        dateTo: dateToInput,
        customers: customersInput,
        suppliers: suppliersInput,
        types: invoicePaymentTypesInput,
      },
    },
  })

  return {
    locale: locale as Locale,
    filters,
    initialInvoiceGroups:
      icelandicGovernmentInstitutionsInvoiceGroups ?? undefined,
    organization: getOrganization ?? undefined,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OpenInvoices,
    OpenInvoicesOverview,
  ),
)
