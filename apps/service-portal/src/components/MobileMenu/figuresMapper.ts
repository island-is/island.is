import { ServicePortalPath } from '@island.is/service-portal/core'

export const getMobileMenuFigure = (path: ServicePortalPath | undefined) => {
  if (path === ServicePortalPath.FjarmalRoot)
    return '/assets/images/payment.svg'
  if (path === ServicePortalPath.MinGognRoot)
    return '/assets/images/jobsGrid.svg'
  if (path === ServicePortalPath.FamilyRoot)
    return '/assets/images/familyGrid.svg'
  if (path === ServicePortalPath.HeilsaRoot) return '/assets/images/health.svg'
  if (path === ServicePortalPath.MenntunRoot)
    return '/assets/images/education.svg'
  if (path === ServicePortalPath.EignirRoot) return '/assets/images/school.svg'
  return '/assets/images/school.svg'
}
