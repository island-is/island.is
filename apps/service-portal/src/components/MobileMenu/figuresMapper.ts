import { ServicePortalPath } from '@island.is/service-portal/core'

export const getMobileMenuFigure = (path: ServicePortalPath | undefined) => {
  const basePath = '/minarsidur/assets/images/'
  let imgName = 'jobsGrid.svg'
  if (
    path === ServicePortalPath.FinanceRoot ||
    path === ServicePortalPath.FinanceExternal
  )
    imgName = 'payment.svg'
  if (path === ServicePortalPath.MyInfoRoot) imgName = 'myInfo.svg'
  if (path === ServicePortalPath.FamilyRoot) imgName = 'familyGrid.svg'
  if (path === ServicePortalPath.HealthRoot) imgName = 'health.svg'
  if (
    path === ServicePortalPath.EducationRoot ||
    path === ServicePortalPath.EducationExternal
  )
    imgName = 'education.svg'
  if (path === ServicePortalPath.AssetsRoot) imgName = 'school.svg'
  if (path === ServicePortalPath.ApplicationIntroduction)
    imgName = 'jobsGrid.svg'
  if (path === ServicePortalPath.ElectronicDocumentsRoot)
    imgName = 'myDocuments.svg'
  if (path === ServicePortalPath.MyLicensesRoot) imgName = 'myRights.svg'
  if (path === ServicePortalPath.SettingsRoot) imgName = 'settings.svg'

  return basePath + imgName
}
