import { generateYamlForEnv } from '../dsl/serialize-to-yaml'
import { OpsEnv } from '../dsl/types/input-types'
import { ServiceHelm } from '../dsl/types/output-types'
import { UberChart } from '../dsl/uber-chart'
import { Envs } from '../environments'
import { ChartName, ChartNames, charts } from '../uber-charts/all-charts'

const renderUrlsForService = ({ ingress = {} }: ServiceHelm) => {
  const urls: string[] = []
  Object.keys(ingress).forEach((ingressName) => {
    ingress[ingressName].hosts.forEach((host) => {
      host.paths.forEach((path: string) => {
        urls.push(`https://${host.host}${path}`)
      })
    })
  })
  return urls
}

const renderUrlsForChart = (environment: OpsEnv, chartName: ChartName) => {
  const { services } = generateYamlForEnv(
    new UberChart(Envs[environment]),
    ...charts[chartName][environment],
  )
  return Object.keys(services).reduce((acc, serviceName) => {
    const urls = renderUrlsForService(services[serviceName])
    if (urls.length <= 0) {
      return acc
    }
    return { ...acc, [serviceName]: urls }
  }, {})
}

export const renderUrls = (environment: OpsEnv) => {
  console.log(
    ChartNames.reduce((acc, chartName) => {
      return { ...acc, ...renderUrlsForChart(environment, chartName) }
    }, {}),
  )
}
