import { generateYamlForEnv, dumpYaml } from '../dsl/serialize-to-yaml'
import { OpsEnv } from '../dsl/types/input-types'
import { UberChart } from '../dsl/uber-chart'
import { Envs } from '../environments'
import { ChartName, ChartNames, charts } from '../uber-charts/all-charts'
import { OpsEnvName } from '../dsl/types/charts'

export const renderEnv = (env: OpsEnvName, chartName: ChartName) => {
  let uberChart = new UberChart(Envs[env])
  return dumpYaml(
    uberChart,
    generateYamlForEnv(uberChart, ...charts[chartName][env]),
  )
}
