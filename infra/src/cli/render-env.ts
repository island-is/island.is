import { renderHelmValueFile } from '../dsl/process-services'
import { OpsEnv } from '../dsl/types/input-types'
import { UberChart } from '../dsl/uber-chart'
import { Envs } from '../environments'
import { ChartName, Charts, Deployments } from '../uber-charts/all-charts'
import { dumpServiceHelm } from '../dsl/yaml'

export const renderEnv = (env: OpsEnv, chartName: ChartName) => {
  let uberChart = new UberChart(Envs[Deployments[chartName][env]])
  return dumpServiceHelm(
    uberChart,
    renderHelmValueFile(uberChart, ...Charts[chartName][env]),
  )
}
