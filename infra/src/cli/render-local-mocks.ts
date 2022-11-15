import { Envs } from '../environments'
import { Charts, Deployments } from '../uber-charts/all-charts'
import { toServices } from '../dsl/exports/to-services'
import { renderer } from '../dsl/processing/service-sets'
import { renderers } from '../dsl/upstream-dependencies'
import { Localhost } from '../dsl/localhost-runtime'
import { getLocalSetup } from '../dsl/value-files-generators/get-local-setup'
import { withUpstreamDependencies } from '../dsl/upstream-dependencies'
import { GRAPHQL_API_URL_ENV_VAR_NAME } from '../../../apps/application-system/api/infra/application-system-api'
import { ref } from '../dsl/dsl'

export const renderLocalServices = async (services: string[]) => {
  const chartName = 'islandis'
  const env = 'dev'
  const envConfig = Envs[Deployments[chartName][env]]
  envConfig.type = 'local'
  let uberChart = new Localhost(envConfig)
  const habitat = Charts[chartName][env]
  const fullSetOfServices = await withUpstreamDependencies(
    envConfig,
    toServices(habitat),
    toServices(habitat.filter((s) => services.includes(s.name()))),
    renderers.localrun,
  )

  const api = fullSetOfServices.find((s) => s.name === 'api')
  const applicationSystemAPI = fullSetOfServices.find(
    (s) => s.name === 'application-system-api',
  )
  if (api && applicationSystemAPI) {
    applicationSystemAPI.env[GRAPHQL_API_URL_ENV_VAR_NAME] = ref(
      (h) => `http://${h.svc(habitat.find((s) => s.name() === 'api')!)}`,
    )
  }

  return getLocalSetup(
    uberChart,
    await renderer(uberChart, fullSetOfServices, renderers.localrun),
  )
}
