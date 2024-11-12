import { serviceSetup as unicornAppSetup } from '../../../apps/unicorn-app/infra/infra'

import { EnvironmentServices } from '.././dsl/types/charts'
const unicornApp = unicornAppSetup()

export const Services: EnvironmentServices = {
  prod: [unicornApp],
  staging: [unicornApp],
  dev: [unicornApp],
}
