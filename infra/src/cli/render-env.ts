import { renderHelmValueFile } from '../dsl/process-services'
import { OpsEnv } from '../dsl/types/input-types'
import { Kubernetes } from '../dsl/kubernetes'
import { Envs } from '../environments'
import { ChartName, Charts, Deployments } from '../uber-charts/all-charts'
import { dumpServiceHelm } from '../dsl/yaml'

export const renderEnv = async (env: OpsEnv, chartName: ChartName) => {
  let uberChart = new Kubernetes(Envs[Deployments[chartName][env]])
  return dumpServiceHelm(
    uberChart,
    await renderHelmValueFile(uberChart, ...Charts[chartName][env]),
  )
}
