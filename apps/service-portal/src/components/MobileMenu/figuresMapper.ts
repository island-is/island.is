import { ServicePortalPath } from '@island.is/service-portal/core'
import { ProjectBasePath } from '@island.is/shared/constants'

export const getMobileMenuFigure = (path?: string) => {
  const basePath = `${ProjectBasePath.ServicePortal}/assets/images/`
  let imgName

  switch (path) {
    case ServicePortalPath.FinanceRoot:
    case ServicePortalPath.FinanceExternal:
      imgName = 'payment.svg'
      break

    case ServicePortalPath.MyInfoRoot:
      imgName = 'myInfo.svg'
      break

    case ServicePortalPath.HealthRoot:
      imgName = 'health.svg'
      break

    case ServicePortalPath.EducationRoot:
    case ServicePortalPath.EducationExternal:
      imgName = 'education.svg'
      break

    case ServicePortalPath.AssetsRoot:
      imgName = 'school.svg'
      break

    case ServicePortalPath.ApplicationRoot:
      imgName = 'jobsGrid.svg'
      break

    case ServicePortalPath.ElectronicDocumentsRoot:
      imgName = 'myDocuments.svg'
      break

    case ServicePortalPath.MyLicensesRoot:
      imgName = 'myRights.svg'
      break

    case ServicePortalPath.SettingsRoot:
      imgName = 'settings.svg'
      break

    default:
      imgName = 'jobsGrid.svg'
  }

  return `${basePath}${imgName}`
}
