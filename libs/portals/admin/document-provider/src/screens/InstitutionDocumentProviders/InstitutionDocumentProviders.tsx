import { useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Breadcrumbs,
  DatePicker,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { ProvidersTable } from '../../components/DocumentProvidersTable/DocumentProvidersTable'
import { InstitutionDocumentProvidersDashboard } from './InstitutionDocumentProvidersDashboard'
import { IntroHeader } from '@island.is/portals/core'
import { useGetProvidersByNationalId } from '../../shared/useGetProvidersByNationalId'

import { useUserInfo } from '@island.is/react-spa/bff'
import { useGetStatisticsByNationalId } from '../../shared/useGetStatisticsByNationalId'
import { StatisticBoxList } from '../../components/StatisticBoxList/StatisticBoxList'

import startOfMonth from 'date-fns/startOfMonth'
import subYears from 'date-fns/subYears'

import { DocumentProviderPaths } from '../../lib/paths'
import { StatisticsBoxData } from '../../lib/types'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { useNavigate } from 'react-router-dom'

const InstitutionDocumentProviders = () => {
  const today = new Date()

  // first day of the current month
  const firstOfThisMonth = startOfMonth(today)

  // first day of the same month, one year ago
  const firstOfLastYearMonth = startOfMonth(subYears(today, 1))

  const [fromDate, setFromDate] = useState<Date | undefined>(
    firstOfLastYearMonth,
  )
  const [toDate, setToDate] = useState<Date | undefined>(firstOfThisMonth)

  const { formatMessage } = useLocale()
  const user = useUserInfo()
  const navigate = useNavigate()

  const { loading: loadingStatistics, statistics } =
    useGetStatisticsByNationalId(fromDate, toDate)

  const { loading: loadingProviders, items: providers } =
    useGetProvidersByNationalId(undefined, undefined)

  const statisticsBox: StatisticsBoxData[] = [
    {
      name: formatMessage(m.statisticsBoxOrganisationsCount),
      value: statistics?.providerCount || 0,
    },
    {
      name: formatMessage(m.statisticsBoxPublishedDocuments),
      value: statistics?.statistics?.published || 0,
    },
    {
      name: formatMessage(m.statisticsBoxOpenedDocuments),
      value: statistics?.statistics?.opened || 0,
    },
  ]

  return (
    <>
      <Breadcrumbs
        items={[
          { title: formatMessage(m.documentProvidersTitle) },
          ...(user?.profile?.name
            ? [
                {
                  title: user.profile.name,
                  href: DocumentProviderPaths.DocumentProviderOverview,
                },
              ]
            : []),
        ]}
      />

      <Box marginTop={1} marginBottom={[2, 3, 5]}>
        <IntroHeader
          title={formatMessage(m.documentProvidersTitle)}
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
                selected={fromDate}
                locale="is"
                minDate={new Date(2011, 0, 1)}
                maxDate={new Date()}
                minYear={2011}
                maxYear={today.getFullYear()}
                handleChange={(date: Date) => setFromDate(date)}
                size="sm"
                appearInline={true}
              />
            </GridColumn>
            <GridColumn span="6/12">
              <DatePicker
                id="toDate"
                label={formatMessage(m.documentProvidersDateToLabel)}
                placeholderText={formatMessage(
                  m.documentProvidersDateToPlaceholderText,
                )}
                selected={toDate}
                locale="is"
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
                appearInline={true}
              />
            </GridColumn>
          </GridRow>
        </Box>

        <StatisticBoxList
          loading={loadingStatistics}
          statistics={statisticsBox || []}
        />

        <InstitutionDocumentProvidersDashboard />

        <ProvidersTable
          providerPath={
            DocumentProviderPaths.DocumentProviderDocumentProvidersSingle
          }
          loading={loadingProviders}
          providers={providers || []}
        ></ProvidersTable>
      </Box>
    </>
  )
}

export default InstitutionDocumentProviders
