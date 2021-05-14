import { serviceSetup as apiSetup } from '../../../apps/air-discount-scheme/api/infra/api'
import { serviceSetup as webSetup } from '../../../apps/air-discount-scheme/web/infra/web'
import { serviceSetup as backendSetup } from '../../../apps/air-discount-scheme/backend/infra/backend'

import { EnvironmentServices } from '.././dsl/types/charts'

const adsBackend = backendSetup()
const adsApi = apiSetup({ adsBackend })
const adsWeb = webSetup({ adsApi })

export const Services: EnvironmentServices = {
  prod: [adsWeb, adsBackend, adsApi],
  staging: [adsWeb, adsBackend, adsApi],
  dev: [adsWeb, adsBackend, adsApi],
}
