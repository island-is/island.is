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
import { environment as env } from '../environments'
import { documentProviderModule } from '@island.is/service-portal/document-provider'

type ModuleFeatureFlag = keyof typeof env.featureFlags

const mapper: Record<ModuleFeatureFlag, ServicePortalModule> = {
  applications: applicationsModule,
  documents: documentsModule,
  settings: settingsModule,
  finance: financeModule,
  family: familyModule,
  health: healthModule,
  education: educationModule,
  delegation: eligibilityModule,
  assets: assetsModule,
  drivingLicense: drivingLicenseModule,
  documentProvider: documentProviderModule,
}

export const modules = () => {
  const arr: ServicePortalModule[] = []
  Object.keys(env.featureFlags).forEach((k) => {
    const key = k as ModuleFeatureFlag
    if (env.featureFlags[key]) arr.push(mapper[key])
  })

  return arr
}
