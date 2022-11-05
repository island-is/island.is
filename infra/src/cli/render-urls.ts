import { OpsEnv } from '../dsl/types/input-types'
import { ServiceHelm } from '../dsl/types/output-types'
import { Kubernetes } from '../dsl/kubernetes'
import { Envs } from '../environments'
import {
  ChartName,
  ChartNames,
  Charts,
  Deployments,
} from '../uber-charts/all-charts'
import { renderHelmValueFile } from '../dsl/output-generators/render-helm-value-file'

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

const renderUrlsForChart = async (
  environment: OpsEnv,
  chartName: ChartName,
) => {
  const { services } = await renderHelmValueFile(
    new Kubernetes(Envs[Deployments[chartName][environment]]),
    ...Charts[chartName][environment],
  )
  return Object.keys(services).reduce((acc, serviceName) => {
    const urls = renderUrlsForService(services[serviceName])
    if (urls.length <= 0) {
      return acc
    }
    return { ...acc, [serviceName]: urls }
  }, {})
}

export const renderUrls = async (environment: OpsEnv) => {
  console.log(
    await ChartNames.reduce(async (acc, chartName) => {
      return {
        ...(await acc),
        ...(await renderUrlsForChart(environment, chartName)),
      }
    }, Promise.resolve({})),
  )
}
