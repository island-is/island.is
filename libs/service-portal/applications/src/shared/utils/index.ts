import { Application, ApplicationStatus } from '@island.is/application/types'
import { institutionMapper } from '@island.is/application/types'
import { Organization } from '@island.is/shared/types'
import { ServicePortalPath } from '@island.is/service-portal/core'
import {
  ApplicationOverViewStatus,
  FilterValues,
  InstitutionOption,
} from '../types'

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
): InstitutionOption[] | undefined => {
  const apps: Application[] = applications
  let institutions: InstitutionOption[] = []
  if (!organizations) {
    return
  }
  apps.forEach((elem) => {
    const inst = institutionMapper[elem.typeId].slug ?? 'INSTITUTION_MISSING'
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
    return ApplicationOverViewStatus.completed
  }
  return ApplicationOverViewStatus.all
}

export const getBaseUrlForm = () => {
  const path = window.location.origin
  const isLocalhost = path.includes('localhost')
  return isLocalhost ? 'http://localhost:4242/umsoknir' : `${path}/umsoknir`
}

export const getFilteredApplicationsByStatus = (
  filterValue: FilterValues,
  applications: Application[] = [],
  filteredOutApplication: string | undefined = undefined,
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
      filteredOutApplication !== application.id &&
      // Search in active institution, if value is empty then "Allar stofnanir" is selected so it does not filter.
      // otherwise it filters it.
      (activeInstitution !== ''
        ? institutionMapper[application.typeId].slug === activeInstitution
        : true),
  )
  return sortApplicationsStatus(filteredApps)
}

export const getInstitutions = (
  defaultInstitution: InstitutionOption,
  applications: Application[],
  organizations: any,
): InstitutionOption[] => {
  if (!applications || !organizations) {
    return [defaultInstitution]
  }
  const institutions =
    sortApplicationsOrganizations(applications, organizations) || []
  return [defaultInstitution, ...institutions]
}
