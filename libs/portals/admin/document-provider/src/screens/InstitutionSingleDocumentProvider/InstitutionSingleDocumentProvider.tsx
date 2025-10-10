import { useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'

import {
  Box,
  Breadcrumbs,
  DatePicker,
  GridColumn,
  GridRow,
  Pagination,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { InstitutionDocumentProviderDashboard } from './InstitutionDocumentProviderDashboard'
import { IntroHeader } from '@island.is/portals/core'
import { useGetStatisticsOverviewByProviderId } from '../../shared/useGetStatisticsOverviewByProviderId'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetProviderStatisticsBreakdownByProviderId } from '../../shared/useGetProviderStatisticsBreakdownByProviderId'
import { DocumentProviderStatisticsTable } from '../../components/DocumentProviderStatisticsTable/DocumentProviderStatisticsTable'
import { useUserInfo } from '@island.is/react-spa/bff'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { StatisticBoxList } from '../../components/StatisticBoxList/StatisticBoxList'
import { DocumentProviderPaths } from '../../lib/paths'
import { StatisticsBoxData } from '../../lib/types'
import { DOCUMENT_DELIVERY_PRICE_ISK } from '../../lib/constants'

const SingleDocumentProvider = () => {
  const today = new Date()
  // Set toDate to the first day of the current month
  const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  // Set fromDate to the first day of the same month, one year ago
  const firstOfLastYearMonth = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    1,
  )
  const [fromDate, setFromDate] = useState<Date | undefined>(
    firstOfLastYearMonth,
  )

  const [toDate, setToDate] = useState<Date | undefined>(firstOfThisMonth)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { providerId } = useParams<{ providerId: string }>()

  const user = useUserInfo()

  const { loading, statistics } = useGetStatisticsOverviewByProviderId(
    providerId,
    fromDate,
    toDate,
  )

  const { loading: loadingBreakdown, breakdown } =
    useGetProviderStatisticsBreakdownByProviderId(
      providerId,
      undefined,
      undefined,
      'Date',
      true,
      pageNumber,
      pageSize,
    )

  const statisticsBox: StatisticsBoxData[] = [
    {
      name: formatMessage(m.statisticsBoxPublishedDocuments),
      value: statistics?.statistics?.published || 0,
    },
    {
      name: formatMessage(m.statisticsBoxOpenedDocuments),
      value: statistics?.statistics?.opened || 0,
    },
    {
      name: formatMessage(m.statisticsBoxFailures),
      value: statistics?.statistics?.failures || 0,
    },
    {
      name: formatMessage(m.statisticsBoxBenefitInCrowns),
      value:
        (statistics?.statistics?.published ?? 0) * DOCUMENT_DELIVERY_PRICE_ISK,
    },
  ]

  useEffect(() => {
    if (breakdown?.totalCount !== undefined && pageSize > 0) {
      setNumPages(Math.ceil(breakdown.totalCount / pageSize))
    }
  }, [breakdown?.totalCount, pageSize])

  return (
    <>
      <Breadcrumbs
        items={[
          { title: formatMessage(m.documentProviders) },
          {
            title: user?.profile?.name ?? '',
            href: DocumentProviderPaths.DocumentProviderOverview,
          },
          { title: statistics?.name ? String(statistics.name) : '' },
        ]}
      />
      <Box marginTop={1} marginBottom={[2, 3, 5]}>
        <IntroHeader
          title={
            statistics?.name
              ? String(statistics.name)
              : formatMessage(m.rootName)
          }
          intro={formatMessage(m.documentProvidersDescription)}
        />
        <Box marginBottom={[2, 3]}>
          <GridRow>
            <GridColumn span="6/12">
              <DatePicker
                id="fromDate"
                label={formatMessage(m.documentProvidersDateFromLabel)}
                placeholderText={formatMessage(
                  m.documentProvidersDateFromPlaceholderText,
                )}
                locale="is"
                selected={fromDate}
                minDate={new Date(2011, 0, 1)}
                maxDate={new Date()}
                minYear={2011}
                maxYear={today.getFullYear()}
                handleChange={(date: Date) => setFromDate(date)}
                size="sm"
              />
            </GridColumn>
            <GridColumn span="6/12">
              <DatePicker
                id="toDate"
                label={formatMessage(m.documentProvidersDateToLabel)}
                placeholderText={formatMessage(
                  m.documentProvidersDateToPlaceholderText,
                )}
                locale="is"
                selected={toDate}
                minDate={new Date(2011, 0, 1)}
                maxDate={new Date()}
                minYear={2011}
                maxYear={today.getFullYear()}
                handleChange={(date: Date) => setToDate(date)}
                hasError={fromDate && toDate && toDate < fromDate}
                errorMessage={formatMessage(
                  m.documentProvidersDateToErrorMessage,
                )}
                size="sm"
              />
            </GridColumn>
          </GridRow>
        </Box>

        <StatisticBoxList
          loading={loading}
          statistics={statisticsBox || []}
          boxesPerRow={4}
        />

        <InstitutionDocumentProviderDashboard providerId={providerId} />

        {breakdown ? (
          <DocumentProviderStatisticsTable
            loading={loadingBreakdown}
            statistics={breakdown}
          />
        ) : null}

        <Box marginTop={2} marginBottom={4}>
          <Pagination
            page={pageNumber}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPageNumber(page)}
              >
                {children}
              </Box>
            )}
            totalPages={numPages}
          />
        </Box>
      </Box>
    </>
  )
}

export default SingleDocumentProvider
