import { Envs } from '../environments'
import { Charts, Deployments } from '../uber-charts/all-charts'
import { toServices } from '../dsl/exports/to-services'
import { renderer } from '../dsl/processing/service-sets'
import { renderers } from '../dsl/downstream-dependencies'
import { Localhost } from '../dsl/localhost-runtime'
import { renderDockerComposeFile } from '../dsl/value-files-generators/render-docker-compose-file'
import { getWithUpstreamServices } from '../dsl/upstream-dependencies'
import { GRAPHQL_API_URL_ENV_VAR_NAME } from '../../../apps/application-system/api/infra/application-system-api'
import { ref } from '../dsl/dsl'

export const renderLocalServices = async (services: string[]) => {
  const chartName = 'islandis'
  const env = 'dev'
  let uberChart = new Localhost(Envs[Deployments[chartName][env]])
  const habitat = Charts[chartName][env]
  const fullSetOfServices = await getWithUpstreamServices(
    Envs[Deployments[chartName][env]],
    toServices(habitat),
    toServices(habitat.filter((s) => services.includes(s.name()))),
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

  return renderDockerComposeFile(
    uberChart,
    await renderer(uberChart, fullSetOfServices, renderers['docker-compose']),
  )
}
