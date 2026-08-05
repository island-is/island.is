import { Employer } from '../../utils/types'

const autoExpandedApplications = new Set<string>()

export const shouldAutoExpandEmployersOverview = (
  applicationId: string,
  rawEmployers: Employer[],
  employers: Employer[],
) =>
  rawEmployers.length === 0 &&
  employers.length === 0 &&
  !autoExpandedApplications.has(applicationId)

export const markEmployersOverviewAutoExpanded = (applicationId: string) => {
  autoExpandedApplications.add(applicationId)
}

export const resetEmployersOverviewAutoExpandState = () => {
  autoExpandedApplications.clear()
}
