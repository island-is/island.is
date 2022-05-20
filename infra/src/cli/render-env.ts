import { generateYamlForEnv, dumpYaml } from '../dsl/serialize-to-yaml'
import { OpsEnv } from '../dsl/types/input-types'
import { UberChart } from '../dsl/uber-chart'
import { Envs } from '../environments'
import {
  ChartName,
  ChartNames,
  Charts,
  Deployments,
} from '../uber-charts/all-charts'
import { OpsEnvName } from '../dsl/types/charts'

export const renderEnv = (env: OpsEnv, chartName: ChartName) => {
  let uberChart = new UberChart(Envs[Deployments[chartName][env]])
  return dumpYaml(
    uberChart,
    generateYamlForEnv(uberChart, ...Charts[chartName][env]),
  )
}
