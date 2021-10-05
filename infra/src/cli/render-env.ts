import { generateYamlForEnv, dumpYaml } from '../dsl/serialize-to-yaml'
import { OpsEnv } from '../dsl/types/input-types'
import { UberChart } from '../dsl/uber-chart'
import { Envs } from '../environments'
import { ChartName, ChartNames, charts } from '../uber-charts/all-charts'

export const renderEnv = (env: OpsEnv, chartName: ChartName) => {
  process.stdout.write(
    dumpYaml(
      generateYamlForEnv(new UberChart(Envs[env]), ...charts[chartName][env]),
    ),
  )
}
