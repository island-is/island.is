import { generateYamlForEnv, dumpYaml } from './dsl/serialize-to-yaml'
import { OpsEnv } from './dsl/types/input-types'
import { UberChart } from './dsl/uber-chart'
import { Envs } from './environments'
import yargs = require('yargs/yargs')
import { ChartName, ChartNames, charts } from './uber-charts/all-charts'

const argv = yargs(process.argv.slice(2)).options({
  env: { choices: ['dev', 'staging', 'prod'] },
  chart: {
    choices: ChartNames,
  },
})

const env = argv.argv.env as OpsEnv
const chart = argv.argv.chart as ChartName

process.stdout.write(
  dumpYaml(generateYamlForEnv(new UberChart(Envs[env]), ...charts[chart][env])),
)
