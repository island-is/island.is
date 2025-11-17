import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import addYears from 'date-fns/addYears'
import format from 'date-fns/format'
import { parseAsBoolean, parseAsIsoDateTime, useQueryState } from 'next-usequerystate'
import { Bar,BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import {
  Box,
  Stack,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { dateFormat } from '@island.is/shared/constants'
import { CustomPageUniqueIdentifier, Locale } from '@island.is/shared/types'
import { ChartsCard } from '@island.is/web/components'
import { Organization, Query, QueryGetOrganizationArgs } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'

import { CustomScreen, withCustomPageWrapper } from '../../CustomPage'
import SidebarLayout from '../../Layouts/SidebarLayout'
import { GET_ORGANIZATION_QUERY } from '../../queries'
import { Chart} from '../components/Chart/Chart'
import { OpenInvoicesWrapper } from '../components/OpenInvoicesWrapper'
import { OverviewFilter } from '../components/OverviewFilter'
import { ORGANIZATION_SLUG } from '../contants'
import { m } from '../messages'
import { MOCK_CHART_1 } from './mockData'

const OpenInvoicesTotalsPage: CustomScreen<OpenInvoicesTotalsProps> = ({
  locale,
  customPageData,
  organization,
}) => {
  useLocalLinkTypeResolver()
  useContentfulId(customPageData?.id)
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const baseUrl = linkResolver('openinvoicestotals', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: formatMessage(m.totals.title),
      href: baseUrl,
      isTag: true,
    },
  ]

  const initialDates = useMemo(() => {
    const today = new Date()
    return {
      dateFrom: addYears(today, -1),
      dateTo: today,
    }
  }, [])

  const [dateRangeStart, setDateRangeStart] = useQueryState(
    'dateRangeStart',
    parseAsIsoDateTime.withDefault(initialDates.dateFrom),
  )
  const [dateRangeEnd, setDateRangeEnd] = useQueryState(
    'dateRangeEnd',
    parseAsIsoDateTime.withDefault(initialDates.dateTo),
  )

  const [comparison, setComparison] = useQueryState(
    'comparison',
    parseAsBoolean.withDefault(false)
  )

  const onSearchFilterUpdate = (categoryId: string, values?: Array<string>) => {
    switch (categoryId) {
      case 'dateRange': {
        const filteredValues = values?.length ? [...values] : null
        const dateStart = filteredValues?.[0]
          ? new Date(filteredValues[0])
          : null
        const dateEnd = filteredValues?.[1] ? new Date(filteredValues[1]) : null

        setDateRangeStart(dateStart)
        setDateRangeEnd(dateEnd)
        break
      }
      case 'comparison': {
        const value: boolean = values?.[0] === 'true'
        setComparison(value)
        break
      }
    }
  }

  const onResetFilter = () => {
    setDateRangeStart(null)
    setDateRangeEnd(null)
    setComparison(false)
  }

  return (
    <OpenInvoicesWrapper
      title={formatMessage(m.totals.title)}
      description={formatMessage(m.totals.description)}
      featuredImage={{
        src: formatMessage(m.totals.featuredImage),
        alt: formatMessage(m.totals.featuredImageAlt),
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
                {formatMessage(m.search.filter)}
              </Text>
              <OverviewFilter
                onSearchUpdate={onSearchFilterUpdate}
                onReset={onResetFilter}
                url={baseUrl}
                locale={locale}
                searchState={{
                  dateRange: [
                    dateRangeStart.toISOString(),
                    dateRangeEnd.toISOString(),
                  ],
                  comparison: [comparison ? 'true' : 'false']
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
                    type: 'checkbox',
                    id: 'comparison',
                    label: 'Samanburður við fyrra ár',
                    checked: comparison,
                  }
                ]}
              />
            </Stack>
          }
        >
          <Box marginLeft={6}>
          <Text marginBottom={4}>Greiðslur á tímabilinu bleble 2024 - blabla 2025</Text>
          <Stack  space={3}>
            <Chart />
          </Stack>
          </Box>
      </SidebarLayout>
      </Box>
    </OpenInvoicesWrapper>
  )
}

interface OpenInvoicesTotalsProps {
  organization?: Organization
  locale: Locale
}

const OpenInvoicesTotals: CustomScreen<OpenInvoicesTotalsProps> = ({
  organization,
  locale,
  customPageData,
}) => {
  return (
    <OpenInvoicesTotalsPage
      organization={organization}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

OpenInvoicesTotals.getProps = async ({ apolloClient, locale }) => {
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
  return {
    locale: locale as Locale,
    organization: getOrganization ?? undefined
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OpenInvoices,
    OpenInvoicesTotals,
  ),
  {showFooter: false},
)
