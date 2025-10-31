import { useMemo, useState } from 'react'
import {
  APPLICATION_SERVICE_PROVIDER_SLUG,
  ActionCardLoader,
  FootNote,
  IntroHeader,
  m as coreMessage,
} from '@island.is/portals/my-pages/core'
import {
  Box,
  GridRow,
  GridColumn,
  Input,
  Select,
} from '@island.is/island-ui/core'
import {
  useApplications,
  useFormSystemApplications,
  useGetOrganizationsQuery,
} from '@island.is/portals/my-pages/graphql'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useLocation } from 'react-router-dom'
import { m } from '../lib/messages'
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
import { Problem } from '@island.is/react-spa/shared'

const defaultInstitution: InstitutionOption = {
  label: '',
  value: '',
}

const defaultFilterValues: FilterValues = {
  activeInstitution: defaultInstitution,
  searchQuery: '',
}

const Overview = () => {
  useNamespaces(['sp.applications', 'application.system'])
  const { formatMessage, locale } = useLocale()
  const {
    data: applicationsData,
    loading: applicationsLoading,
    error: applicationsError,
    refetch: applicationsRefetch,
  } = useApplications()
  const {
    data: formSystemData,
    loading: formSystemLoading,
    error: formSystemError,
    refetch: formSystemRefetch,
  } = useFormSystemApplications()
  const location = useLocation()
  const statusToShow = mapLinkToStatus(location.pathname)
  let focusedApplication: Application | undefined

  const { data: orgData, loading: loadingOrg } = useGetOrganizationsQuery({
    variables: {
      input: {
        lang: locale,
      },
    },
  })

  const combinedApplications: Application[] = useMemo(() => {
    const a = applicationsData ?? []
    const b = formSystemData ?? []
    if (!a.length && !b.length) return []
    const map = new Map<string, Application>()
    ;[...a, ...b].forEach((app) => {
      if (app) map.set(app.id, app)
    })
    return Array.from(map.values()).sort((x, y) => {
      const xt = x.modified ? new Date(x.modified).getTime() : 0
      const yt = y.modified ? new Date(y.modified).getTime() : 0
      return yt - xt
    })
  }, [applicationsData, formSystemData])

  const loading = applicationsLoading || formSystemLoading
  const error = applicationsError || formSystemError

  const refetch = async () => {
    await Promise.all([applicationsRefetch(), formSystemRefetch()])
  }

  defaultInstitution.label = formatMessage(m.defaultInstitutionLabel)

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

  const organizations = orgData?.getOrganizations?.items || []

  const institutions = getInstitutions(
    defaultInstitution,
    combinedApplications,
    organizations,
  )

  if (combinedApplications && location.hash) {
    focusedApplication = combinedApplications.find(
      (item: Application) => item.id === location.hash.slice(1),
    )
  }

  const applicationsSortedByStatus = getFilteredApplicationsByStatus(
    filterValue,
    combinedApplications,
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
    (combinedApplications.length === 0 && !focusedApplication) ||
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
        serviceProviderSlug={APPLICATION_SERVICE_PROVIDER_SLUG}
      />
      {(loading || loadingOrg || !orgData) && <ActionCardLoader repeat={3} />}
      {(error || (!loading && !combinedApplications)) && (
        <Problem error={error} noBorder={false} />
      )}
      {combinedApplications &&
        combinedApplications.length > 0 &&
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
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(coreMessage.noDataFoundVariableFeminine, {
            arg: formatMessage(coreMessage.applications).toLowerCase(),
          })}
          message={formatMessage(getNoApplicationsError(statusToShow))}
          imgSrc="./assets/images/empty.svg"
        />
      )}
      <FootNote serviceProviderSlug={APPLICATION_SERVICE_PROVIDER_SLUG} />
    </>
  )
}

export default Overview
