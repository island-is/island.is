import { useState } from 'react'
import {
  ActionCardLoader,
  EmptyState,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import {
  Text,
  Box,
  Stack,
  GridRow,
  GridColumn,
  Input,
  Select,
  Option,
} from '@island.is/island-ui/core'
import { ApplicationList as List } from '@island.is/application/ui-components'
import { useApplications } from '@island.is/service-portal/graphql'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as Sentry from '@sentry/react'
import { useLocation } from 'react-router-dom'
import { useGetOrganizationsQuery } from '../../../graphql/src/schema'
import { m } from '../lib/messages'
import { ValueType } from 'react-select'
import { Application } from '@island.is/application/types'
import {
  getBaseUrlForm,
  getFilteredApplicationsByStatus,
  getInstitutions,
  mapLinkToStatus,
} from '../shared/utils'
import { ApplicationOverViewStatus } from '../shared/types'
import { applicationGroup } from '../components/applicationGroup'

const defaultInstitution = { label: 'Allar stofnanir', value: '' }

type FilterValues = {
  activeInstitution: Option
  searchQuery: string
}

const defaultFilterValues: FilterValues = {
  activeInstitution: defaultInstitution,
  searchQuery: '',
}

const Overview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.applications')
  useNamespaces('application.system')
  Sentry.configureScope((scope) => scope.setTransactionName('Applications'))

  const { formatMessage } = useLocale()
  const { data: applications, loading, error, refetch } = useApplications()
  const location = useLocation()
  const statusToShow = mapLinkToStatus(location.pathname)

  const {
    data: orgData,
    loading: loadingOrg,
    error: orgError,
  } = useGetOrganizationsQuery()

  const [filterValue, setFilterValue] = useState<FilterValues>(
    defaultFilterValues,
  )

  const handleSearchChange = (value: string) => {
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      searchQuery: value,
    }))
  }

  const handleInstitutionChange = (newInstitution: ValueType<Option>) => {
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      activeInstitution: newInstitution as Option,
    }))
  }

  if (
    orgError ||
    error ||
    (!loading && !applications) ||
    (!loadingOrg && !orgData)
  ) {
    return <EmptyState description={m.error} />
  }
  const organizations = orgData?.getOrganizations?.items || ([] as any)

  const institutions = getInstitutions(
    defaultInstitution,
    applications,
    organizations,
  )

  const applicationsSortedByStatus = getFilteredApplicationsByStatus(
    filterValue,
    applications,
  )

  return (
    <Box key="application-overview">
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {formatMessage(m.heading)}
              </Text>
              <Text as="p" variant="default">
                {formatMessage(m.introCopy)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>

      {(loading || loadingOrg || !orgData) && <ActionCardLoader repeat={3} />}

      {(error || orgError) && <EmptyState description={m.error} />}

      {!error && !loading && !applications && (
        <EmptyState description={m.noApplicationsAvailable} />
      )}

      {applications &&
        orgData &&
        !loading &&
        !loadingOrg &&
        !error &&
        !orgError && (
          <>
            <Box paddingBottom={[3, 5]}>
              <GridRow alignItems="flexEnd">
                <GridColumn span={['1/1', '1/2']}>
                  <Box height="full">
                    <Input
                      icon="search"
                      backgroundColor="blue"
                      size="xs"
                      value={filterValue.searchQuery}
                      onChange={(ev) => handleSearchChange(ev.target.value)}
                      name="umsoknir-leit"
                      label={formatMessage(m.searchLabel)}
                      placeholder={formatMessage(m.searchPlaceholder)}
                    />
                  </Box>
                </GridColumn>
                <GridColumn paddingTop={[2, 0]} span={['1/1', '1/2']}>
                  <Box height="full">
                    <Select
                      name="institutions"
                      backgroundColor="blue"
                      size="xs"
                      defaultValue={institutions[0]}
                      options={institutions}
                      value={filterValue.activeInstitution}
                      onChange={(e) => {
                        handleInstitutionChange(e)
                      }}
                      label={formatMessage(m.searchInstitutiontLabel)}
                    />
                  </Box>
                </GridColumn>
              </GridRow>
            </Box>

            {applicationsSortedByStatus.incomplete?.length > 0 &&
              (statusToShow === ApplicationOverViewStatus.all ||
                statusToShow === ApplicationOverViewStatus.incomplete) &&
              applicationGroup(
                applicationsSortedByStatus.incomplete,
                formatMessage(m.incompleteApplications),
                organizations,
                refetch,
              )}

            {applicationsSortedByStatus.inProgress?.length > 0 &&
              (statusToShow === ApplicationOverViewStatus.all ||
                statusToShow === ApplicationOverViewStatus.inProgress) &&
              applicationGroup(
                applicationsSortedByStatus.inProgress,
                formatMessage(m.inProgressApplications),
                organizations,
                refetch,
              )}

            {applicationsSortedByStatus.finished?.length > 0 &&
              (statusToShow === ApplicationOverViewStatus.all ||
                statusToShow === ApplicationOverViewStatus.finished) &&
              applicationGroup(
                applicationsSortedByStatus.finished,
                formatMessage(m.finishedApplications),
                organizations,
                refetch,
              )}
          </>
        )}
    </Box>
  )
}

export default Overview
