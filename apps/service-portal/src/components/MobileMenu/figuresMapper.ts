import { ServicePortalPath } from '@island.is/service-portal/core'

export const getMobileMenuFigure = (path: ServicePortalPath | undefined) => {
  if (path === ServicePortalPath.FjarmalRoot)
    return '/assets/images/payment.jpg'
  if (path === ServicePortalPath.MinGognRoot) return '/assets/images/jobs.jpg'
  if (path === ServicePortalPath.FjolskyldanRoot)
    return '/assets/images/family.jpg'
  if (path === ServicePortalPath.HeilsaRoot) return '/assets/images/baby.jpg'
  if (path === ServicePortalPath.MenntunRoot)
    return '/assets/images/education.jpg'
  if (path === ServicePortalPath.EignirRoot) return '/assets/images/school.jpg'
  return '/assets/images/school.jpg'
}
