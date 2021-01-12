import { ServicePortalModule } from '@island.is/service-portal/core'
import { applicationsModule } from '@island.is/service-portal/applications'
import { documentsModule } from '@island.is/service-portal/documents'
import { settingsModule } from '@island.is/service-portal/settings'
import { financeModule } from '@island.is/service-portal/finance'
import { familyModule } from '@island.is/service-portal/family'
import { healthModule } from '@island.is/service-portal/health'
import { educationModule } from '@island.is/service-portal/education'
import { assetsModule } from '@island.is/service-portal/assets'
import { eligibilityModule } from '@island.is/service-portal/eligibility'
import { drivingLicenseModule } from '@island.is/service-portal/driving-license'
import { environment } from '../environments'

const {
  applications,
  documents,
  settings,
  finance,
  family,
  health,
  education,
  delegation,
  assets,
  drivingLicense,
} = environment.featureFlags

export const modules = () => {
  const arr: ServicePortalModule[] = []
  if (applications) {
    arr.push(applicationsModule)
  }
  if (documents) {
    arr.push(documentsModule)
  }
  if (settings) {
    arr.push(settingsModule)
  }
  if (finance) {
    arr.push(financeModule)
  }
  if (family) {
    arr.push(familyModule)
  }
  if (health) {
    arr.push(healthModule)
  }
  if (education) {
    arr.push(educationModule)
  }
  if (delegation) {
    arr.push(eligibilityModule)
  }
  if (assets) {
    arr.push(assetsModule)
  }
  if (drivingLicense) {
    arr.push(drivingLicenseModule)
  }
  return arr
}
