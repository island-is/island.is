import { useState } from 'react'
import {
  ActionCardLoader,
  EmptyState,
  IntroHeader,
} from '@island.is/service-portal/core'
import {
  Box,
  GridRow,
  GridColumn,
  Input,
  Select,
} from '@island.is/island-ui/core'
import {
  useApplications,
  useGetOrganizationsQuery,
} from '@island.is/service-portal/graphql'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useLocation } from 'react-router-dom'
import { m } from '../lib/messages'
import { m as coreMessage } from '@island.is/service-portal/core'
import {
  getFilteredApplicationsByStatus,
  getInstitutions,
  mapLinkToStatus,
} from '../shared/utils'
import {
  ApplicationOverViewStatus,
  FilterValues,
  InstitutionOption,
} from '../shared/types'
import { ApplicationGroup } from '../components/ApplicationGroup'
import { Application } from '@island.is/application/types'
import { ErrorScreen } from '@island.is/service-portal/core'

const defaultInstitution: InstitutionOption = {
  label: 'Allar stofnanir',
  value: '',
}

const defaultFilterValues: FilterValues = {
  activeInstitution: defaultInstitution,
  searchQuery: '',
}

const Overview = () => {
  useNamespaces('sp.applications')
  useNamespaces('application.system')
  const { formatMessage } = useLocale()
  const { data: applications, loading, error, refetch } = useApplications()
  const location = useLocation()
  const statusToShow = mapLinkToStatus(location.pathname)
  let focusedApplication: Application | undefined

  const { data: orgData, loading: loadingOrg } = useGetOrganizationsQuery()

  const [filterValue, setFilterValue] =
    useState<FilterValues>(defaultFilterValues)

  const handleSearchChange = (value: string) => {
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      searchQuery: value,
    }))
  }

  const handleInstitutionChange = (newInstitution: InstitutionOption) => {
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      activeInstitution: newInstitution,
    }))
  }

  if (error || (!loading && !applications)) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(coreMessage.errorTitle)}
        title={formatMessage(coreMessage.somethingWrong)}
        children={formatMessage(coreMessage.errorFetchModule, {
          module: formatMessage(coreMessage.applications).toLowerCase(),
        })}
      />
    )
  }

  const organizations = orgData?.getOrganizations?.items || []

  const institutions = getInstitutions(
    defaultInstitution,
    applications,
    organizations,
  )

  if (applications && location.hash) {
    focusedApplication = applications.find(
      (item: Application) => item.id === location.hash.slice(1),
    )
  }

  const applicationsSortedByStatus = getFilteredApplicationsByStatus(
    filterValue,
    applications,
    focusedApplication?.id,
  )

  const GetIntroductionHeadingOrIntro = (
    status: ApplicationOverViewStatus,
    heading = false,
  ) => {
    switch (status) {
      case ApplicationOverViewStatus.completed:
        return heading ? m.headingFinished : m.introCopyFinished
      case ApplicationOverViewStatus.inProgress:
        return heading ? m.headingInProgress : m.introCopyInProgress
      case ApplicationOverViewStatus.incomplete:
        return heading ? m.headingIncomplete : m.introCopyIncomplete
      default:
        return heading ? m.heading : m.introCopy
    }
  }

  const getNoApplicationsError = (status: ApplicationOverViewStatus) => {
    switch (status) {
      case ApplicationOverViewStatus.completed:
        return m.noCompletedApplicationsAvailable
      case ApplicationOverViewStatus.inProgress:
        return m.noInProgressApplicationsAvailable
      case ApplicationOverViewStatus.incomplete:
        return m.noIncompleteApplicationsAvailable
      default:
        return m.noApplicationsAvailable
    }
  }

  const noApplications =
    (applications.length === 0 && !focusedApplication) ||
    (statusToShow === ApplicationOverViewStatus.incomplete &&
      applicationsSortedByStatus.incomplete.length === 0) ||
    (statusToShow === ApplicationOverViewStatus.inProgress &&
      applicationsSortedByStatus.inProgress.length === 0) ||
    (statusToShow === ApplicationOverViewStatus.completed &&
      applicationsSortedByStatus.finished.length === 0)

  return (
    <>
      <IntroHeader
        title={GetIntroductionHeadingOrIntro(statusToShow, true)}
        intro={GetIntroductionHeadingOrIntro(statusToShow)}
      />

      {(loading || loadingOrg || !orgData) && <ActionCardLoader repeat={3} />}

      {applications &&
        applications.length > 0 &&
        orgData &&
        !loading &&
        !loadingOrg &&
        !error && (
          <>
            <Box paddingBottom={[3, 5]}>
              <GridRow alignItems="flexEnd">
                <GridColumn span={['1/1', '1/2']}>
                  <Box height="full">
                    <Input
                      icon={{ name: 'search' }}
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
                        if (e) {
                          handleInstitutionChange(e)
                        }
                      }}
                      label={formatMessage(m.searchInstitutiontLabel)}
                    />
                  </Box>
                </GridColumn>
              </GridRow>
            </Box>
            {focusedApplication && (
              <ApplicationGroup
                applications={[focusedApplication]}
                label={formatMessage(m.focusedApplication)}
                organizations={organizations}
                refetch={refetch}
                focus={true}
              />
            )}
            {applicationsSortedByStatus.incomplete?.length > 0 &&
              (statusToShow === ApplicationOverViewStatus.all ||
                statusToShow === ApplicationOverViewStatus.incomplete) && (
                <ApplicationGroup
                  applications={applicationsSortedByStatus.incomplete}
                  label={formatMessage(m.incompleteApplications)}
                  organizations={organizations}
                  refetch={refetch}
                />
              )}
            {applicationsSortedByStatus.inProgress?.length > 0 &&
              (statusToShow === ApplicationOverViewStatus.all ||
                statusToShow === ApplicationOverViewStatus.inProgress) && (
                <ApplicationGroup
                  applications={applicationsSortedByStatus.inProgress}
                  label={formatMessage(m.inProgressApplications)}
                  organizations={organizations}
                  refetch={refetch}
                />
              )}
            {applicationsSortedByStatus.finished?.length > 0 &&
              (statusToShow === ApplicationOverViewStatus.all ||
                statusToShow === ApplicationOverViewStatus.completed) && (
                <ApplicationGroup
                  applications={applicationsSortedByStatus.finished}
                  label={formatMessage(m.finishedApplications)}
                  organizations={organizations}
                  refetch={refetch}
                />
              )}
          </>
        )}
      {!error && !loading && noApplications && (
        <EmptyState description={getNoApplicationsError(statusToShow)} />
      )}
    </>
  )
}

export default Overview
