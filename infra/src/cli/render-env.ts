import { OpsEnv } from '../dsl/types/input-types'
import { Kubernetes } from '../dsl/kubernetes'
import { Envs } from '../environments'
import { ChartName, Charts, Deployments } from '../uber-charts/all-charts'
import { dumpServiceHelm } from '../dsl/yaml'
import { renderHelmValueFile } from '../dsl/output-generators/render-helm-value-file'

export const renderEnv = async (env: OpsEnv, chartName: ChartName) => {
  let uberChart = new Kubernetes(Envs[Deployments[chartName][env]])
  return dumpServiceHelm(
    uberChart,
    await renderHelmValueFile(uberChart, ...Charts[chartName][env]),
  )
}
