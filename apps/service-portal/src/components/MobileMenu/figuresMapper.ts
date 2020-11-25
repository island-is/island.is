import { ServicePortalPath } from '@island.is/service-portal/core'

export const getMobileMenuFigure = (path: ServicePortalPath | undefined) => {
  if (path === ServicePortalPath.FinanceRoot)
    return '/assets/images/payment.svg'
  if (path === ServicePortalPath.MyInfoRoot) return '/assets/images/myInfo.svg'
  if (path === ServicePortalPath.FamilyRoot)
    return '/assets/images/familyGrid.svg'
  if (path === ServicePortalPath.HealthRoot) return '/assets/images/health.svg'
  if (path === ServicePortalPath.EducationRoot)
    return '/assets/images/education.svg'
  if (path === ServicePortalPath.AssetsRoot) return '/assets/images/school.svg'
  if (path === ServicePortalPath.ApplicationIntroduction)
    return '/assets/images/jobsGrid.svg'
  if (path === ServicePortalPath.ElectronicDocumentsRoot)
    return '/assets/images/myDocuments.svg'
  if (path === ServicePortalPath.MyLicensesRoot)
    return '/assets/images/myRights.svg'
  if (path === ServicePortalPath.SettingsRoot)
    return '/assets/images/settings.svg'

  return '/assets/images/school.svg'
}
