import { Application, ApplicationStatus } from '@island.is/application/types'
import { Option } from '@island.is/island-ui/core'
import { institutionMapper } from '@island.is/application/core'
import { Organization } from '@island.is/shared/types'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { ApplicationOverViewStatus, FilterValues } from '../types'

interface SortedApplication {
  incomplete: Application[]
  inProgress: Application[]
  finished: Application[]
}

export const sortApplicationsStatus = (
  applications: Application[],
): SortedApplication => {
  const incomplete: Application[] = []
  const inProgress: Application[] = []
  const finished: Application[] = []

  applications.forEach((application) => {
    if (
      application.state === 'draft' ||
      application.state === 'prerequisites'
    ) {
      incomplete.push(application)
    } else if (application.status === ApplicationStatus.IN_PROGRESS) {
      inProgress.push(application)
    } else {
      finished.push(application)
    }
  })

  return {
    incomplete,
    inProgress,
    finished,
  }
}

export const sortApplicationsOrganizations = (
  applications: Application[],
  organizations?: Organization[],
): Option[] | undefined => {
  const apps: Application[] = applications
  let institutions: Option[] = []
  if (!organizations) {
    return
  }
  apps.forEach((elem) => {
    const inst = institutionMapper[elem.typeId] ?? 'INSTITUTION_MISSING'
    institutions.push({
      value: inst,
      label: organizations.find((x) => x.slug === inst)?.title ?? inst,
    })
  })
  // Remove duplicates
  institutions = institutions.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.value === value.value),
  )
  // Sort alphabetically
  institutions.sort((a, b) => a.label.localeCompare(b.label))
  return institutions
}

export const mapLinkToStatus = (link: string) => {
  if (link === ServicePortalPath.ApplicationInProgressApplications) {
    return ApplicationOverViewStatus.inProgress
  }
  if (link === ServicePortalPath.ApplicationIncompleteApplications) {
    return ApplicationOverViewStatus.incomplete
  }
  if (link === ServicePortalPath.ApplicationCompleteApplications) {
    return ApplicationOverViewStatus.finished
  }
  return ApplicationOverViewStatus.all
}

export const getBaseUrlForm = () => {
  const isLocalhost = window.location.origin.includes('localhost')
  const isDev = window.location.origin.includes('beta.dev01.devland.is')
  const isStaging = window.location.origin.includes('beta.staging01.devland.is')

  return isLocalhost
    ? 'http://localhost:4242/umsoknir'
    : isDev
    ? 'https://beta.dev01.devland.is/umsoknir'
    : isStaging
    ? 'https://beta.staging01.devland.is/umsoknir'
    : 'https://island.is/umsoknir'
}

export const getFilteredApplicationsByStatus = (
  filterValue: FilterValues,
  applications: Application[] = [],
) => {
  const { searchQuery } = filterValue
  const activeInstitution = filterValue?.activeInstitution?.value
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
  return sortApplicationsStatus(filteredApps)
}

export const getInstitutions = (
  defaultInstitution: { value: string; label: string },
  applications: Application[],
  organizations: any,
) => {
  if (!applications || !organizations) {
    return [defaultInstitution]
  }
  const institutions =
    sortApplicationsOrganizations(applications, organizations) || []
  return [defaultInstitution, ...institutions]
}
