import { useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'

import {
  Box,
  Breadcrumbs,
  DatePicker,
  GridColumn,
  GridContainer,
  GridRow,
  Pagination,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { DocumentProviderDashboard } from './DocumentProviderDashboard'
import { IntroHeader } from '@island.is/portals/core'
import { useGetStatisticsOverviewByProviderId } from '../../shared/useGetStatisticsOverviewByProviderId'
import { useParams } from 'react-router-dom'
import { useGetProviderStatisticsBreakdownByProviderId } from '../../shared/useGetProviderStatisticsBreakdownByProviderId'
import { DocumentProviderStatisticsTable } from '../../components/DocumentProviderStatisticsTable/DocumentProviderStatisticsTable'
import { useGetProviderStatisticsBreakdownWCategoriesByProviderId } from '../../shared/useGetProviderStatisticsBreakdownWCategoriesByProviderId'
import { useGetProvidersByNationalId } from '../../shared/useGetProvidersByNationalId'
import { useUserInfo } from '@island.is/react-spa/bff'
import { DocumentProvidersNavigation } from '../../components/DocumentProvidersNavigation/DocumentProvidersNavigation'
import { DocumentProvidersLoading } from '../../components/DocumentProvidersLoading/DocumentProvidersLoading'
import {
  StatisticBoxList,
  StatisticsBoxData,
} from '../../components/StatisticBoxList/StatisticBoxList'

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

  const { providerId } = useParams<{ providerId: string }>()

  const user = useUserInfo()

  const { loading, statistics } = useGetStatisticsOverviewByProviderId(
    user.profile.nationalId,
    providerId,
    fromDate,
    toDate,
  )
  const { loading: loadingProviders, items: providers } =
    useGetProvidersByNationalId(user.profile.nationalId, undefined, undefined)

  const { chartData } = useGetProviderStatisticsBreakdownByProviderId(
    providerId,
    user.profile.nationalId,
    undefined,
    undefined,
    'Date',
    true,
    1,
    6,
  )
  const { loading: loadingSentFiles, chartData: sentFilesChartData } =
    useGetProviderStatisticsBreakdownWCategoriesByProviderId(
      providerId,
      user.profile.nationalId,
      undefined,
      undefined,
      'Date',
      true,
      1,
      6,
    )
  const { loading: loadingBreakdown, breakdown } =
    useGetProviderStatisticsBreakdownByProviderId(
      providerId,
      user.profile.nationalId,
      undefined,
      undefined,
      'Date',
      true,
      pageNumber,
      pageSize,
    )

  const statisticsBoxdata: StatisticsBoxData[] = [
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
  ]

  useEffect(() => {
    if (breakdown?.totalCount !== undefined && pageSize > 0) {
      setNumPages(Math.ceil(breakdown.totalCount / pageSize))
    }
  }, [breakdown?.totalCount, pageSize])

  if (loading && loadingSentFiles && loadingBreakdown && loadingProviders) {
    return <DocumentProvidersLoading />
  }

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn
          span={['12/12', '5/12', '5/12', '3/12']}
          offset={['0', '7/12', '7/12', '0']}
        >
          <Box paddingBottom={4}>
            <DocumentProvidersNavigation providers={providers || []} />
          </Box>
        </GridColumn>
        <GridColumn
          paddingTop={[5, 5, 5, 2]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          <Breadcrumbs
            items={[
              { title: 'Skjalaveitur' },
              { title: user.profile.name, href: 'skjalaveitur/yfirlit' },
              { title: statistics?.name ? String(statistics.name) : '' },
            ]}
          />
          <Box marginTop={1} marginBottom={[2, 3, 5]}>
            <IntroHeader
              title={statistics?.name ? String(statistics.name) : 'Skjalaveita'}
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
                    minDate={new Date(2011, 1, 1)}
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
                    minDate={new Date(2011, 1, 1)}
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
              statistics={statisticsBoxdata || []}
            />

            <DocumentProviderDashboard
              sentFilesData={sentFilesChartData}
              chartData={chartData}
            />

            {breakdown ? (
              <DocumentProviderStatisticsTable {...breakdown} />
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
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default SingleDocumentProvider
