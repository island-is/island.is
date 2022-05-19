import { serviceSetup as jsApiSetup } from '../../../apps/judicial-system/api/infra/judicial-system-api'
import { serviceSetup as jsBackendSetup } from '../../../apps/judicial-system/backend/infra/judicial-system-backend'
import { serviceSetup as jsWebSetup } from '../../../apps/judicial-system/web/infra/judicial-system-web'
import { serviceSetup as jsXrdApiSetup } from '../../../apps/judicial-system/xrd-api/infra/judicial-system-xrd-api'
import { serviceSetup as jsSchedulerSetup } from '../../../apps/judicial-system/scheduler/infra/judicial-system-scheduler'

import { EnvironmentServices } from '.././dsl/types/charts'

const jsBack = jsBackendSetup()
const jsApi = jsApiSetup({ backend: jsBack })
const jsWeb = jsWebSetup({ api: jsApi })
const jsXrdApi = jsXrdApiSetup({ backend: jsBack })
const jsScheduler = jsSchedulerSetup({ backend: jsBack })

export const Services: EnvironmentServices = {
  prod: [jsApi, jsBack, jsWeb, jsXrdApi, jsScheduler],
  staging01: [jsApi, jsBack, jsWeb, jsXrdApi, jsScheduler],
  dev01: [jsApi, jsBack, jsWeb, jsXrdApi, jsScheduler],
  'prod-ids': [],
}
