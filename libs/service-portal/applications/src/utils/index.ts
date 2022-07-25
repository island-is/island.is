import { Application, ApplicationStatus } from '@island.is/application/types'
import { Option } from '@island.is/island-ui/core'
import { institutionMapper } from '@island.is/application/core'
import { Organization } from '@island.is/shared/types'

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

export const sortApplicationsOrganziations = (
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
