import { serviceSetup as jsApiSetup } from '../../../apps/judicial-system/api/infra/judicial-system-api'
import { serviceSetup as jsBackendSetup } from '../../../apps/judicial-system/backend/infra/judicial-system-backend'
import { serviceSetup as jsWebSetup } from '../../../apps/judicial-system/web/infra/judicial-system-web'
import { serviceSetup as jsXrdApiSetup } from '../../../apps/judicial-system/xrd-api/infra/judicial-system-xrd-api'

import { EnvironmentServices } from '../../../libs/helm/dsl/types/charts'

const jsBack = jsBackendSetup()
const jsApi = jsApiSetup({ backend: jsBack })
const jsWeb = jsWebSetup({ api: jsApi })
const jsXrdApi = jsXrdApiSetup({ backend: jsBack })

export const Services: EnvironmentServices = {
  prod: [jsApi, jsBack, jsWeb, jsXrdApi],
  staging: [jsApi, jsBack, jsWeb, jsXrdApi],
  dev: [jsApi, jsBack, jsWeb, jsXrdApi],
}
