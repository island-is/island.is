import React, { useCallback, useEffect, useState } from 'react'
import { defineMessage, MessageDescriptor } from 'react-intl'
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
import { institutionMapper } from '@island.is/application/core'
import {
  getBaseUrlForm,
  mapLinkToStatus,
  sortApplicationsOrganziations,
  sortApplicationsStatus,
} from '../shared/utils'
import { ApplicationOverViewStatus } from '../shared/types'

const defaultInstitution = { label: 'Allar stofnanir', value: '' }

type FilterValues = {
  activeInstitution: Option
  searchQuery: string
}

const defaultFilterValues: FilterValues = {
  activeInstitution: defaultInstitution,
  searchQuery: '',
}

const ApplicationOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.applications')
  useNamespaces('application.system')
  Sentry.configureScope((scope) => scope.setTransactionName('Applications'))

  const { formatMessage } = useLocale()
  const { data: applications, loading, error, refetch } = useApplications()
  const location = useLocation()

  const {
    data: orgData,
    loading: loadingOrg,
    error: errorOrg,
  } = useGetOrganizationsQuery()
  const [organizations, setOrganizations] = useState<any[]>([])

  const [applicationsByStatus, setApplicationsByStatus] = useState<{
    incomplete: Application[]
    inProgress: Application[]
    finished: Application[]
  }>({
    incomplete: [],
    inProgress: [],
    finished: [],
  })

  const [institutions, setInstitutions] = useState<Option[]>([
    defaultInstitution,
  ])

  const [filterValue, setFilterValue] = useState<FilterValues>(
    defaultFilterValues,
  )

  const [statusToShow, setStatusToShow] = useState<ApplicationOverViewStatus>(
    ApplicationOverViewStatus.all,
  )

  const setAllApplications = useCallback((apps: Application[]) => {
    const applicationsSorted = sortApplicationsStatus(apps)
    setApplicationsByStatus(applicationsSorted)
  }, [])

  const setApplicationInstitutions = useCallback(() => {
    const institutions =
      sortApplicationsOrganziations(applications, organizations) || []
    setInstitutions([defaultInstitution, ...institutions])
  }, [applications, organizations])

  const searchApplications = useCallback(() => {
    const searchQuery = filterValue.searchQuery
    const activeInstitution = filterValue.activeInstitution.value
    const filteredApps = (applications as Application[]).filter(
      (application: Application) =>
        // Search in name and description
        (application.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          application.actionCard?.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())) &&
        // Search in active institution, if value is empty then "Allar stofnanir" is selected so it does not filter.
        // otherwise it filters it.
        (activeInstitution !== ''
          ? institutionMapper[application.typeId] === activeInstitution
          : true),
    )
    setAllApplications(filteredApps)
  }, [applications, filterValue, setAllApplications])

  useEffect(() => {
    if (orgData?.getOrganizations?.items) {
      setOrganizations(orgData?.getOrganizations?.items)
    }
  }, [orgData])

  useEffect(() => {
    if (location) {
      setStatusToShow(mapLinkToStatus(location.pathname))
    }
  }, [location])

  useEffect(() => {
    setApplicationInstitutions()
    searchApplications()
  }, [filterValue, searchApplications, setApplicationInstitutions])

  useEffect(() => {
    setApplicationInstitutions()
    setAllApplications(applications)
  }, [applications, setApplicationInstitutions, setAllApplications])

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

  const applicationList = (
    applications: Application[],
    label: MessageDescriptor,
  ) => {
    return (
      <>
        <Text paddingTop={4} paddingBottom={3} variant="eyebrow">
          {formatMessage(label)}
        </Text>
        <List
          organizations={organizations}
          applications={applications}
          refetch={refetch}
          onClick={(applicationUrl) =>
            window.open(`${getBaseUrlForm()}/${applicationUrl}`)
          }
        />
      </>
    )
  }

  return (
    <Box key="applicatio-overview">
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

      {loading || (loadingOrg && !orgData && <ActionCardLoader repeat={3} />)}

      {error && <EmptyState description={m.error} />}

      {!error && !loading && !applications && (
        <EmptyState
          description={defineMessage({
            id: 'sp.applications:no-applications-available',
            defaultMessage:
              'Engar umsóknir fundust hjá Ísland.is á þessari kennitölu',
          })}
        />
      )}

      {applications && orgData && !loading && !error && (
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

          {applicationsByStatus.incomplete?.length > 0 &&
            (statusToShow === ApplicationOverViewStatus.all ||
              statusToShow === ApplicationOverViewStatus.incomplete) &&
            applicationList(
              applicationsByStatus.incomplete,
              m.incompleteApplications,
            )}

          {applicationsByStatus.inProgress?.length > 0 &&
            (statusToShow === ApplicationOverViewStatus.all ||
              statusToShow === ApplicationOverViewStatus.inProgress) &&
            applicationList(
              applicationsByStatus.inProgress,
              m.inProgressApplications,
            )}

          {applicationsByStatus.finished?.length > 0 &&
            (statusToShow === ApplicationOverViewStatus.all ||
              statusToShow === ApplicationOverViewStatus.finished) &&
            applicationList(
              applicationsByStatus.finished,
              m.finishedApplications,
            )}
        </>
      )}
    </Box>
  )
}

export default ApplicationOverview
